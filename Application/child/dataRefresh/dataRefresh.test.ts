import dataRefresh from "./dataRefresh";
import testUtils from "../../../utils/testUtils";
import { HardhatLocalNetwork } from "../../../Class/Chains";
import { BigNumber, Contract, ethers } from "ethers";
import { DEXData, priceUpdate } from "../../../Class/primitives";
import { expect } from "chai";

describe("dataRefresh",function(){
    //this.timeout(30000);
    describe("start", function () {
        let ERC20s:Contract[];
        let router:Contract;
        let factory:Contract;
        let dexDataDict:{[address:string]:DEXData} = {};

        let timeCalled = 0;

        before("test", ()=>{
        });

        before("publish ERC20s",async function (){
            ERC20s = await testUtils.erc20.generateTestToken(3,1000000000,3);
        });

        before("setUpUniswap",async function(){
            let response = await testUtils.uniswapV2Like.setUp();
            factory= response.factory;
            router = response.router;
        });
        before("setUp Dex",async function(){
            let pairs = await testUtils.uniswapV2Like.generatePairs(3,{factory,router},ERC20s);
            (pairs).forEach((pair)=>{
                dexDataDict[pair.address]=pair;
            });
        });

        it("inital conditions are fine",async ()=>{
            let numberOfPair:BigNumber = await factory.allPairsLength();
            expect(numberOfPair.eq(3)).equal(true,"not enough pairs");

        });

        
        it("works",()=>{
            return new Promise<void>(async (resolve,reject)=>{

                let signerAddress = await HardhatLocalNetwork.signer.getAddress();
                let compiledERC20 = require("../../../Ethereum/Ethereum/sources/ERC20.sol/DevToken.json");
                
                dataRefresh.start(HardhatLocalNetwork,dexDataDict,(blockNumber:number,priceUpdates:priceUpdate[])=>{
                    expect(priceUpdates[0].t0InstantPrice).ok;
                    timeCalled+=1;
                    if(timeCalled==Object.keys(dexDataDict).length+1){
                        resolve();
                    }
                });

                async function wait(time:number) {
                    return new Promise((resolve,reject)=>{
                        setTimeout(resolve,time);
                    });
                }

                await wait(10000);

                try{
                    Object.values(dexDataDict).forEach(async (dexData)=>{
                        let value:number = 100000000;

                        let tokenContract:Contract = new Contract(dexData.token0,compiledERC20.abi,HardhatLocalNetwork.signer);
                        let token1Contract:Contract = new Contract(dexData.token1,compiledERC20.abi,HardhatLocalNetwork.signer);
                        tokenContract.approve(router.address,value);
                        
                        let tx = await router.swapExactTokensForTokens(value/2,value/2*.9,[dexData.token0,dexData.token1],signerAddress,(Date.now()+10000).toString());
                        await tx.wait();
                        //console.log(`Swap: ${dexData.address}: ${dexData.token0} => ${dexData.token1}`);
                    });
                }catch(err){
                    reject(err);
                }
                
            })
        });
    });
});
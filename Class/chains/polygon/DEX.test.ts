import { SushiV2 } from "./DEX";
import {HardhatLocalNetwork as hdhn} from "../../Chains";

import { Contract, ethers } from "ethers";

import chai from "chai";
chai.use(require('chai-bn')(ethers.BigNumber));
var expect = chai.expect;

import { Chain, Dex, DEXData, DEXTYPE } from "../../primitives";
import testUtils from "../../../utils/testUtils";

describe("Polygon DEX tests",function(){
    this.timeout(16000);
    describe("SushiSwapv2",async function(){

        var erc20_0:Contract;
        var erc20_1:Contract;

        var uniswapFactory :Contract;
        var pair: Contract;
        var router:Contract;

        var t0t1Dex:Dex;

        var signerAddress:string;

        before("Set Signer address",async () => {
            //get signer address
            signerAddress = await hdhn.signer.getAddress();
        });
        before("Deploy 2 erc20",async () => {
            //deploy 2 erc20
            [erc20_0,erc20_1] = await testUtils.erc20.generateTestToken(2,1000000,5);
        });
        before("Deploy Uniswap",async () => {
            //deploy uniswap factory and router
            let response = await testUtils.uniswapV2Like.setUp()
            uniswapFactory = response.factory;
            router = response.router;
        });

        before("Set up dex",async ()=>{
            return new Promise(async(resolve,reject)=>{
                try{
                    //deploy pair
                    var tx = await uniswapFactory.createPair(erc20_0.address,erc20_1.address);
                    await tx.wait();
    
                    //get pair address
                    var pairAddress:string = await uniswapFactory.allPairs(0);
                    const compiledUniswapPair:any = require("@uniswap/v2-core/build/UniswapV2Pair.json");
                    pair = new Contract(pairAddress,compiledUniswapPair.abi,hdhn.signer);
                    var t0 = await pair.token0();
                    var t1 = await pair.token1();
    
                    //Setup Dex
                    var data:DEXData = {
                        address:pairAddress,
                        token0:t0,
                        token1:t1,
                        type:DEXTYPE.SushiV2,
                        token0Amount:1,
                        token1Amount:1,
                        chain:Chain.hardhat
                    }
                    t0t1Dex = new SushiV2(data,hdhn.signer);
                    resolve();
                }catch(err){
                    reject (err);
                }
            });  
        });

        it("Deployed a pair contract", async ()=>{
            expect(await pair.deployed()).to.be.ok;
        });
        it("Intantiated t0t1Dex",()=>{
            expect(t0t1Dex).to.be.ok;
        });

        describe("update()",function(){
            //  call update and assert it returns the right values
                //  Not testing for burning should be ok
            it("Update when sending liquidity to the contract",async()=>{
                return new Promise<void>(async (resolve,reject) => {
                    try{
                        //set allowance
                        const a0 = erc20_0.approve(router.address,"1000000");
                        const a1 = erc20_1.approve(router.address,"1000000");

                        //wait for every thing to settle
                        await Promise.all([a0,a1]);

                        //Add liquidity
                        var a = await router.addLiquidity(
                            erc20_0.address,
                            erc20_1.address,
                            "100000",
                            "100000",
                            "10",
                            "10",
                            signerAddress,
                            (Date.now()+10000).toString()
                        );

                        await a.wait();

                        //verify liquidity have been deployed
                        await t0t1Dex.update();
                        expect(ethers.BigNumber.from(t0t1Dex.token0Amount).eq(t0t1Dex.token1Amount)).to.be.equal(true,"Values are not equal");
                        resolve(); // 
                    }catch(err){
                        reject(err);
                    }
                });
            });
            it("Sends a swap", async ()=>{
                var tx = await router.swapExactTokensForTokens("1000","900", [erc20_0.address,erc20_1.address],signerAddress,(Date.now()+10000).toString());
                await tx.wait();
                await t0t1Dex.update();

                expect(ethers.BigNumber.from(t0t1Dex.token0Amount).gt(t0t1Dex.token1Amount)).to.be.equal(erc20_0.address.toLocaleLowerCase() == t0t1Dex.token0,"Token0 amount shouldbe greater than Token1 amount");
            });
        });
    });
});
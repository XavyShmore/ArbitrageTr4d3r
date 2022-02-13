import { SushiV2 } from "./DEX";
import {HardhatLocalNetwork as hdhn} from "../../Chains";

import { Contract, ethers } from "ethers";

import chai from "chai";
chai.use(require('chai-bn')(ethers.BigNumber));
var expect = chai.expect;

import { Chain, Dex, DEXData, DEXTYPE } from "../../primitives";

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
            const compiledERC20 = require("../../../Ethereum/Ethereum/sources/ERC20.sol/DevToken.json");
            var erc20Factory = new ethers.ContractFactory(compiledERC20.abi,compiledERC20.bytecode,hdhn.signer);

            erc20_0 = await erc20Factory.deploy("1000000", "Token 0", "5", "T0");
            erc20_1 = await erc20Factory.deploy("1000000", "Token 1", "5", "T1");
        });
        before("Deploy Uniswap",async () => {
            //deploy uniswap factory
            const compiledUniswapFactory:any = require("@uniswap/v2-core/build/UniswapV2Factory.json");
            uniswapFactory = await new ethers.ContractFactory(compiledUniswapFactory.interface,compiledUniswapFactory.bytecode,hdhn.signer).deploy(signerAddress);

            //deploy uniswap router
            const compiledUniswapRouter = require("@uniswap/v2-periphery/build/UniswapV2Router02");
            router = await new ethers.ContractFactory(compiledUniswapRouter.abi,compiledUniswapRouter.bytecode,hdhn.signer).deploy(uniswapFactory.address,signerAddress);
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

        it("Deployed correctly erc20 tokens and gave 1000000 balance",async function(){
            return new Promise(async (resolve, reject) => {
                try{

                    await Promise.all([verify(erc20_0),verify(erc20_1)]);
                    resolve();
                    async function verify(contract:Contract){
                        expect((await contract.balanceOf(signerAddress)).eq(1000000)).is.true;
                    }

                } catch(err){
                    reject(err);
                }
            });
        });

        it("Deployed Uniswap v2 factory",async () => {
            await uniswapFactory.deployTransaction.wait();
            expect(await uniswapFactory.deployed(),"Failed to deploy uniswapFactory").is.ok;
        });
        it("Deployed uniswap router",async ()=>{
            await router.deployTransaction.wait();
            expect(await router.deployed(),"Failed to deploy uniswap router").to.be.ok;
        });
        it("Deployed a pair contract", async ()=>{
            expect(await pair.deployed()).to.be.ok;
        });
        it("Intantiated t0t1Dex",()=>{
            expect(t0t1Dex).to.be.ok;
        })

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
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mainDex_1 = require("./mainDex");
const Chains_1 = require("../Chains");
const ethers_1 = require("ethers");
const chai_1 = __importDefault(require("chai"));
chai_1.default.use(require('chai-bn')(ethers_1.ethers.BigNumber));
var expect = chai_1.default.expect;
const primitives_1 = require("../primitives");
const testUtils_1 = __importDefault(require("../../utils/testUtils"));
describe(" DEX tests", function () {
    this.timeout(16000);
    describe("UniswapV2Like", async function () {
        var erc20_0;
        var erc20_1;
        var uniswapFactory;
        var pair;
        var router;
        var t0t1Dex;
        var signerAddress;
        before("Set Signer address", async () => {
            //get signer address
            signerAddress = await Chains_1.HardhatLocalNetwork.signer.getAddress();
        });
        before("Deploy 2 erc20", async () => {
            //deploy 2 erc20
            [erc20_0, erc20_1] = await testUtils_1.default.erc20.generateTestToken(2, 1000000, 5);
        });
        before("Deploy Uniswap", async () => {
            //deploy uniswap factory and router
            let response = await testUtils_1.default.uniswapV2Like.setUp();
            uniswapFactory = response.factory;
            router = response.router;
        });
        before("Set up dex", async () => {
            return new Promise(async (resolve, reject) => {
                try {
                    //deploy pair
                    var tx = await uniswapFactory.createPair(erc20_0.address, erc20_1.address);
                    await tx.wait();
                    //get pair address
                    var pairAddress = await uniswapFactory.allPairs(0);
                    const compiledUniswapPair = require("@uniswap/v2-core/build/UniswapV2Pair.json");
                    pair = new ethers_1.Contract(pairAddress, compiledUniswapPair.abi, Chains_1.HardhatLocalNetwork.signer);
                    var t0 = await pair.token0();
                    var t1 = await pair.token1();
                    //Setup Dex
                    var data = {
                        address: pairAddress,
                        token0: t0,
                        token1: t1,
                        type: primitives_1.DEXTYPE.SushiV2,
                        token0Amount: 1,
                        token1Amount: 1,
                        chain: primitives_1.Chain.hardhat
                    };
                    t0t1Dex = new mainDex_1.uniswapV2Like(data, Chains_1.HardhatLocalNetwork.signer);
                    resolve();
                }
                catch (err) {
                    reject(err);
                }
            });
        });
        it("Deployed a pair contract", async () => {
            expect(await pair.deployed()).to.be.ok;
        });
        it("Intantiated t0t1Dex", () => {
            expect(t0t1Dex).to.be.ok;
        });
        describe("update()", function () {
            //  call update and assert it returns the right values
            //  Not testing for burning should be ok
            it("Update when sending liquidity to the contract", async () => {
                return new Promise(async (resolve, reject) => {
                    try {
                        //set allowance
                        const a0 = erc20_0.approve(router.address, "1000000");
                        const a1 = erc20_1.approve(router.address, "1000000");
                        //wait for every thing to settle
                        await Promise.all([a0, a1]);
                        //Add liquidity
                        var a = await router.addLiquidity(erc20_0.address, erc20_1.address, "100000", "100000", "10", "10", signerAddress, (Date.now() + 10000).toString());
                        await a.wait();
                        //verify liquidity have been deployed
                        await t0t1Dex.update();
                        expect(ethers_1.ethers.BigNumber.from(t0t1Dex.token0Amount).eq(t0t1Dex.token1Amount)).to.be.equal(true, "Values are not equal");
                        resolve(); // 
                    }
                    catch (err) {
                        reject(err);
                    }
                });
            });
            it("Sends a swap", async () => {
                var tx = await router.swapExactTokensForTokens("1000", "900", [erc20_0.address, erc20_1.address], signerAddress, (Date.now() + 10000).toString());
                await tx.wait();
                await t0t1Dex.update();
                expect(ethers_1.ethers.BigNumber.from(t0t1Dex.token0Amount).gt(t0t1Dex.token1Amount)).to.be.equal(erc20_0.address.toLocaleLowerCase() == t0t1Dex.token0, "Token0 amount shouldbe greater than Token1 amount");
            });
        });
    });
});

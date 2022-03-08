"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dataRefresh_1 = __importDefault(require("./dataRefresh"));
const testUtils_1 = __importDefault(require("../../../utils/testUtils"));
const Chains_1 = require("../../../Class/Chains");
const ethers_1 = require("ethers");
const chai_1 = require("chai");
describe("dataRefresh", function () {
    //this.timeout(30000);
    describe("start", function () {
        let ERC20s;
        let router;
        let factory;
        let dexDataDict = {};
        let timeCalled = 0;
        before("test", () => {
        });
        before("publish ERC20s", async function () {
            ERC20s = await testUtils_1.default.erc20.generateTestToken(3, 1000000000, 3);
        });
        before("setUpUniswap", async function () {
            let response = await testUtils_1.default.uniswapV2Like.setUp();
            factory = response.factory;
            router = response.router;
        });
        before("setUp Dex", async function () {
            let pairs = await testUtils_1.default.uniswapV2Like.generatePairs(3, { factory, router }, ERC20s);
            (pairs).forEach((pair) => {
                dexDataDict[pair.address] = pair;
            });
        });
        it("inital conditions are fine", async () => {
            let numberOfPair = await factory.allPairsLength();
            (0, chai_1.expect)(numberOfPair.eq(3)).equal(true, "not enough pairs");
        });
        it("works", () => {
            return new Promise(async (resolve, reject) => {
                let signerAddress = await Chains_1.HardhatLocalNetwork.signer.getAddress();
                let compiledERC20 = require("../../../Ethereum/Ethereum/sources/ERC20.sol/DevToken.json");
                dataRefresh_1.default.start(Chains_1.HardhatLocalNetwork, dexDataDict, (blockNumber, priceUpdates) => {
                    (0, chai_1.expect)(priceUpdates[0].t0InstantPrice).ok;
                    timeCalled += 1;
                    if (timeCalled == Object.keys(dexDataDict).length + 1) {
                        resolve();
                    }
                });
                async function wait(time) {
                    return new Promise((resolve, reject) => {
                        setTimeout(resolve, time);
                    });
                }
                await wait(10000);
                try {
                    Object.values(dexDataDict).forEach(async (dexData) => {
                        let value = 100000000;
                        let tokenContract = new ethers_1.Contract(dexData.token0, compiledERC20.abi, Chains_1.HardhatLocalNetwork.signer);
                        let token1Contract = new ethers_1.Contract(dexData.token1, compiledERC20.abi, Chains_1.HardhatLocalNetwork.signer);
                        tokenContract.approve(router.address, value);
                        let tx = await router.swapExactTokensForTokens(value / 2, value / 2 * .9, [dexData.token0, dexData.token1], signerAddress, (Date.now() + 10000).toString());
                        await tx.wait();
                        //console.log(`Swap: ${dexData.address}: ${dexData.token0} => ${dexData.token1}`);
                    });
                }
                catch (err) {
                    reject(err);
                }
            });
        });
    });
});

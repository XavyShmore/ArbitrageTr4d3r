"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GetChain_1 = __importDefault(require("../../../Class/chains/GetChain"));
const ethers_1 = require("ethers");
async function start(chain, dex, updateListener) {
    var activeDex = {};
    //Initialise the provider
    var activeChain = chain;
    console.log("Number of dex", Object.keys(dex).length);
    //Fill active Dex
    for (var [address, dexEntrie] of Object.entries(dex)) {
        var exchange = (0, GetChain_1.default)(activeChain.chain).spawnDex(dexEntrie, activeChain.signer);
        activeDex[address.toLocaleLowerCase()] = exchange;
    }
    async function updateEverything(exchanges, changedDex) {
        const priceUpdateArray = [];
        var test = 0;
        changedDex.forEach((address) => {
            priceUpdateArray.push(exchanges[address].update());
            console.log("test:", test);
            test++;
        });
        return await Promise.all(priceUpdateArray);
    }
    console.log("yeess-1");
    console.log("active chain length", Object.keys(activeDex));
    let updateArray = await updateEverything(activeDex, Object.keys(activeDex));
    console.log("yeess-1,5");
    if (updateArray.length > 0) {
        updateListener(activeChain.provider.blockNumber, updateArray);
    }
    console.log("yess 0");
    let topic0 = [ethers_1.ethers.utils.id("Swap(address,uint256,uint256,uint256,uint256,address)"), ethers_1.ethers.utils.id("Mint(address,uint256, uint256)"), ethers_1.ethers.utils.id("Burn(address,uint256, uint256)")];
    console.log("yeess");
    //Start update on every new block
    activeChain.provider.on("block", async (blockHeight) => {
        console.log("Test 123");
        let filter = {
            topics: [
                topic0
            ],
            fromBlock: blockHeight,
            toBlock: blockHeight
        };
        let logs = await activeChain.provider.getLogs(filter);
        console.log("haha", logs);
        let changedDex = [];
        logs.forEach((log) => {
            let address = log.address.toLocaleLowerCase();
            if (Object.keys(activeDex).includes(address)) {
                changedDex.push(address);
            }
        });
        console.log("Test 123", changedDex);
        //console.log(`Logs for block ${blockHeight}:`, logs);
        //console.log(`Block #${blockHeight}:`,block)
        let updateArray = await updateEverything(activeDex, changedDex);
        console.log("block:", blockHeight, updateArray.length);
        if (updateArray.length > 0) {
            console.log("updateArray:", updateArray);
            updateListener(blockHeight, updateArray);
        }
    });
}
exports.default = {
    start: start
};

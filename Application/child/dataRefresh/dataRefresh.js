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
            test++;
        });
        return await Promise.all(priceUpdateArray);
    }
    let updateArray = await updateEverything(activeDex, Object.keys(activeDex));
    if (updateArray.length > 0) {
        updateListener(activeChain.provider.blockNumber, updateArray);
    }
    let topic0 = [ethers_1.ethers.utils.id("Swap(address,uint256,uint256,uint256,uint256,address)"), ethers_1.ethers.utils.id("Mint(address,uint256, uint256)"), ethers_1.ethers.utils.id("Burn(address,uint256, uint256)")];
    //Start update on every new block
    activeChain.provider.on("block", async (blockHeight) => {
        let filter = {
            topics: [
                topic0
            ],
            fromBlock: blockHeight,
            toBlock: blockHeight
        };
        let logs = await activeChain.provider.getLogs(filter);
        let changedDex = [];
        logs.forEach((log) => {
            let address = log.address.toLocaleLowerCase();
            if (Object.keys(activeDex).includes(address) && !changedDex.includes(address)) {
                changedDex.push(address);
            }
        });
        let updateArray = await updateEverything(activeDex, changedDex);
        if (updateArray.length > 0) {
            updateListener(blockHeight, updateArray);
        }
    });
}
exports.default = {
    start: start
};

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GetChain_1 = __importDefault(require("../../../Class/chains/GetChain"));
async function start(chain, dex, updateListener) {
    var activeDex = {};
    //Initialise the provider
    var activeChain = chain;
    //Fill active Dex
    for (const [address, dexEntrie] of Object.entries(dex)) {
        var exchange = (0, GetChain_1.default)(activeChain.chain).spawnDex(dexEntrie, activeChain.signer);
        activeDex[address] = exchange;
    }
    async function updateEverything(exchanges) {
        const priceUpdateArray = await Promise.all(Object.values(exchanges).map(exchange => exchange.update()));
        const cleanedUpdateArray = [];
        for (var i = 0; i < priceUpdateArray.length; i++) {
            if (priceUpdateArray[i].hasChangedSinceLastUpdate) {
                cleanedUpdateArray.push(priceUpdateArray[i]);
            }
        }
        return cleanedUpdateArray;
    }
    updateListener(activeChain.provider.blockNumber, await updateEverything(activeDex));
    //Start update on every new block
    activeChain.provider.on("block", async (blockHeight) => {
        updateListener(blockHeight, await updateEverything(activeDex));
    });
}
exports.default = start;

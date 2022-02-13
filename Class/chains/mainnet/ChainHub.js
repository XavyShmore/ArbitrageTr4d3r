"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Chains_1 = require("../../Chains");
//import * as DEX from"./DEX";
var mainnetChainHub = {
    spawnDex(data, signer) {
        switch (data.type) {
            default: {
                throw "Dex not implemented on this chain";
            }
        }
    },
    chainClass: Chains_1.mainnet
};
exports.default = mainnetChainHub;

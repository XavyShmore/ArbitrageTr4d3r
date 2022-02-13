"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const primitives_1 = require("../primitives");
const ChainHub_1 = __importDefault(require("./mainnet/ChainHub"));
const ChainHub_2 = __importDefault(require("./polygon/ChainHub"));
function getChain(chain) {
    switch (chain) {
        case primitives_1.Chain.mainnet: {
            return ChainHub_1.default;
        }
        case primitives_1.Chain.ropsten: {
            throw "chain not implemented";
        }
        case primitives_1.Chain.goerli: {
            throw "chain not implemented";
        }
        case primitives_1.Chain.rinkeby: {
            throw "chain not implemented";
        }
        case primitives_1.Chain.polygon: {
            return ChainHub_2.default;
        }
        case primitives_1.Chain.polygonTest: {
            throw "chain not implemented";
        }
        case primitives_1.Chain.hardhat: {
            throw "chain not implemented";
        }
    }
}
exports.default = getChain;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HardhatLocalNetwork = exports.bsc = exports.polygonTest = exports.polygon = exports.goerli = exports.rinkeby = void 0;
const primitives_1 = require("./primitives");
const testOnlyWallet_1 = __importDefault(require("../Wallet/testOnlyWallet"));
//export var mainnet = new ChainClass("To be implemented",Chain.mainnet,testWallet);//Address to be implemented
exports.rinkeby = new primitives_1.ChainClass("wss://speedy-nodes-nyc.moralis.io/308f12c1587841bd314d6066/eth/rinkeby/ws", primitives_1.Chain.rinkeby, testOnlyWallet_1.default);
exports.goerli = new primitives_1.ChainClass("wss://speedy-nodes-nyc.moralis.io/308f12c1587841bd314d6066/eth/goerli/ws", primitives_1.Chain.goerli, testOnlyWallet_1.default);
exports.polygon = new primitives_1.ChainClass("wss://speedy-nodes-nyc.moralis.io/308f12c1587841bd314d6066/polygon/mainnet/ws", primitives_1.Chain.polygon, testOnlyWallet_1.default);
exports.polygonTest = new primitives_1.ChainClass("wss://speedy-nodes-nyc.moralis.io/308f12c1587841bd314d6066/polygon/mumbai/ws", primitives_1.Chain.polygonTest, testOnlyWallet_1.default); // Mumbai
exports.bsc = new primitives_1.ChainClass("https://speedy-nodes-nyc.moralis.io/308f12c1587841bd314d6066/bsc/mainnet", primitives_1.Chain.bsc, testOnlyWallet_1.default);
//export var bscTest = new ChainClass("",Chain.bscTest,testWallet);
exports.HardhatLocalNetwork = new primitives_1.ChainClass("http://127.0.0.1:8545/", primitives_1.Chain.hardhat);

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const GetChain_1 = __importDefault(require("../../Class/chains/GetChain"));
const dataRefresh_1 = __importDefault(require("../child/dataRefresh/dataRefresh"));
const calculatorScript = path_1.default.resolve("../child/calculator/calculator");
const calcOptions = {
    stdio: ["pipe", "pipe", "pipe", "ipc"]
};
//const calculator = fork(calculatorScript,calcOptions)
var workingChain;
var followedDex = {};
function startListening(chain, dex) {
    workingChain = chain;
    (0, dataRefresh_1.default)((0, GetChain_1.default)(chain).chainClass, dex, listenerCallback);
    function listenerCallback(priceUpdate) {
    }
}

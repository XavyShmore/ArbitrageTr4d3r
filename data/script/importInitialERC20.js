"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = __importDefault(require("fs-extra"));
const APImanager_1 = require("../../API/APImanager");
const primitives_1 = require("../../Class/primitives");
var path = `${process.cwd()}/data/script/erc20Addresses.json`;
console.log("Path: ", path);
var data = fs_extra_1.default.readJSONSync(path);
var addresses = [];
for (var a in data.Mainnet) {
    addresses.push(a);
}
APImanager_1.internalDataAPI.addToken(addresses, primitives_1.Chain.mainnet);

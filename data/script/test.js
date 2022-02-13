"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = __importDefault(require("fs-extra"));
var init = fs_extra_1.default.readJSONSync(process.cwd() + "/data/script/erc20Addresses.json");
var sec = fs_extra_1.default.readJSONSync(process.cwd() + "/data/ERC20.json");
console.log("old:", Object.keys(init.Mainnet).length, "new:", Object.keys(sec["0"]).length);

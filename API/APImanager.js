"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.internalDataAPI = exports.ExternalDataAPI = void 0;
const moralis_1 = require("./moralis");
const primitives_1 = require("../Class/primitives");
const fs_extra_1 = __importDefault(require("fs-extra"));
class ExternalDataAPI {
    static getTokenMetadata(addresses, chain) {
        return moralis_1.moralisAPI.getTokenInfoByAddress(addresses, chain);
    }
}
exports.ExternalDataAPI = ExternalDataAPI;
class internalDataAPI {
    //private static _tokenDB:ERC20Data
    //private static _dexDB: 
    static async getTokenMetadata(addresses, chain = primitives_1.Chain.mainnet, update = false) {
        if (update) {
            return await ExternalDataAPI.getTokenMetadata(addresses, chain);
        }
        else {
            console.log(this.dataFolderPath);
            var data;
            var output = {};
            try {
                data = await fs_extra_1.default.readJson(this.tokenDBPath);
                var chainData = data[chain];
                for (var key in chainData) {
                    console.log(key);
                    if (key in addresses) {
                        output[key] = chainData[key];
                    }
                }
            }
            catch (err) {
                console.error(err);
            }
            finally {
                return output;
            }
        }
    }
    static async updateTokenMetadata(chain = primitives_1.Chain.mainnet, addresses) {
        var chainData = { ["asd"]: (0, primitives_1.emptyTokenMetaData)("asd") };
        var newTokens = [];
        var data = {
            1: {},
            4: {},
            31337: {},
            3: {},
            5: {},
            137: {},
            80001: {}
        };
        try {
            data = await fs_extra_1.default.readJSON(this.tokenDBPath);
            chainData = data[chain];
        }
        catch (err) {
            console.error(err);
        }
        if (typeof addresses === 'undefined') {
            addresses = [];
            addresses = Object.keys(chainData);
        }
        else {
            for (var a in addresses) {
                if (!(addresses[a] in chainData)) {
                    chainData[addresses[a]] = (0, primitives_1.emptyTokenMetaData)(addresses[a], chain);
                    newTokens.push(addresses[a]);
                }
            }
        }
        var onlineData = await this.getTokenMetadata(addresses, chain, true);
        function replaceIfNotNull(init, replacement) {
            if (replacement == null) {
                return init;
            }
            else {
                return replacement;
            }
        }
        for (var e in onlineData) {
            var od = onlineData[e];
            var cd = chainData[e];
            chainData[e].name = replaceIfNotNull(cd.name, od.name);
            chainData[e].symbol = replaceIfNotNull(cd.symbol, od.symbol);
            chainData[e].decimals = replaceIfNotNull(cd.decimals, od.decimals);
            chainData[e].logo = replaceIfNotNull(cd.logo, od.logo);
            chainData[e].logo_hash = replaceIfNotNull(cd.logo_hash, od.logo_hash);
            chainData[e].thumbnail = replaceIfNotNull(cd.thumbnail, od.thumbnail);
            chainData[e].block_number = replaceIfNotNull(cd.block_number, od.block_number);
            chainData[e].validated = replaceIfNotNull(cd.validated, od.validated);
        }
        for (var a in newTokens) {
            if (chainData[newTokens[a]] == (0, primitives_1.emptyTokenMetaData)(newTokens[a], chain)) {
                delete chainData[newTokens[a]];
            }
        }
        data[chain] = chainData;
        try {
            fs_extra_1.default.outputJSON(this.tokenDBPath, data);
        }
        catch (err) {
            console.error(err);
        }
        var output = {};
        for (var a in addresses) {
            output[addresses[a]] = chainData[addresses[a]];
        }
        return output;
    }
    static async addToken(adddresses, chain = primitives_1.Chain.mainnet) {
        var newTokens = await this.updateTokenMetadata(chain, adddresses);
        for (var a in adddresses) {
            if (!(Object.keys(newTokens).includes(adddresses[a]))) {
                console.log(`Token ${adddresses[a]} is not found`);
            }
        }
        return newTokens;
    }
}
exports.internalDataAPI = internalDataAPI;
_a = internalDataAPI;
internalDataAPI.rootDir = process.cwd();
internalDataAPI.dataFolderPath = "data";
internalDataAPI.tokenDBPath = `${_a.rootDir}/${_a.dataFolderPath}/ERC20.json`;
internalDataAPI.dexDBPath = `${_a.rootDir}/${_a.dataFolderPath}/DEX.json`;

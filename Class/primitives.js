"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _ChainClass_wallet;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaticJsonRpcBatchProvider = exports.ChainClass = exports.Dex = exports.DEXTYPE = exports.Token = exports.emptyTokenMetaData = exports.Chain = void 0;
const ethers_1 = require("ethers");
var Chain;
(function (Chain) {
    Chain[Chain["mainnet"] = 1] = "mainnet";
    Chain[Chain["ropsten"] = 3] = "ropsten";
    Chain[Chain["rinkeby"] = 4] = "rinkeby";
    Chain[Chain["goerli"] = 5] = "goerli";
    Chain[Chain["polygon"] = 137] = "polygon";
    Chain[Chain["polygonTest"] = 80001] = "polygonTest";
    Chain[Chain["hardhat"] = 31337] = "hardhat";
})(Chain = exports.Chain || (exports.Chain = {}));
function emptyTokenMetaData(adddress, chain = Chain.mainnet) {
    var a = {
        address: adddress,
        chain: chain,
        contractFctGas: {},
        name: null,
        symbol: null,
        decimals: null,
        logo: null,
        logo_hash: null,
        thumbnail: null,
        block_number: null,
        validated: null
    };
    return a;
}
exports.emptyTokenMetaData = emptyTokenMetaData;
class Token {
    constructor(tokenMetadata) {
        this.metadata = tokenMetadata;
    }
}
exports.Token = Token;
var DEXTYPE;
(function (DEXTYPE) {
    DEXTYPE["UniswapV2"] = "UNI-V2";
    DEXTYPE["SushiV2"] = "Sushi-V2";
})(DEXTYPE = exports.DEXTYPE || (exports.DEXTYPE = {}));
class Dex {
    constructor(data, Signer) {
        this._lastT0InstantPrice = ethers_1.ethers.BigNumber.from(0);
        this.address = data.address.toLowerCase();
        this.chain = data.chain;
        this.token0Amount = data.token0Amount;
        this.token1Amount = data.token1Amount;
        this.token0 = data.token0.toLowerCase();
        this.token1 = data.token1.toLowerCase();
        this.type = data.type;
        this.name = data.name;
        this.cote = data.cote;
        this.lastTSX = data.lastTSX;
    }
    getPriceUpdate() {
        let generatePriceUpdate = (hasChangedSinceLastUpdate) => {
            return {
                dexAddress: this.address,
                token0Address: this.token0,
                token1Address: this.token1,
                t1InstantPrice: this.t1InstantPrice(),
                t0InstantPrice: this.t0InstantPrice(),
                hasChangedSinceLastUpdate: hasChangedSinceLastUpdate
            };
        };
        if (this._lastT0InstantPrice == this.t0InstantPrice()) {
            return generatePriceUpdate(false);
        }
        else {
            return generatePriceUpdate(true);
        }
    }
}
exports.Dex = Dex;
class ChainClass {
    constructor(providerAddress, chain, wallet) {
        _ChainClass_wallet.set(this, void 0);
        this.providerAddress = providerAddress;
        this.provider = new StaticJsonRpcBatchProvider(this.providerAddress);
        __classPrivateFieldSet(this, _ChainClass_wallet, wallet, "f");
        if (__classPrivateFieldGet(this, _ChainClass_wallet, "f")) {
            __classPrivateFieldGet(this, _ChainClass_wallet, "f").connect(this.provider);
            this.signer = __classPrivateFieldGet(this, _ChainClass_wallet, "f");
        }
        else {
            this.signer = this.provider.getSigner();
        }
        this.chain = chain;
    }
    getBlockHeight() {
        return this.provider.getBlockNumber();
    }
}
exports.ChainClass = ChainClass;
_ChainClass_wallet = new WeakMap();
class StaticJsonRpcBatchProvider extends ethers_1.ethers.providers.JsonRpcBatchProvider {
    async getNetwork() {
        if (this._network) {
            return Promise.resolve(this._network);
        }
        return super.getNetwork();
    }
}
exports.StaticJsonRpcBatchProvider = StaticJsonRpcBatchProvider;

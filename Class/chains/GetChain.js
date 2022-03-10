"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const primitives_1 = require("../primitives");
const cc = __importStar(require("../Chains"));
const mainDex_1 = require("../mainDex/mainDex");
function returnSpawnDexWithFilterAndChainClass(supportedDex, chainClass) {
    function spawnDex(data, signer) {
        if (!(supportedDex.includes(data.type))) {
            throw new Error("This dex is not supported on this chain");
        }
        switch (data.type) {
            case primitives_1.DEXTYPE.SushiV2: {
                return new mainDex_1.uniswapV2Like(data, signer);
            }
            case primitives_1.DEXTYPE.UniswapV2: {
                return new mainDex_1.uniswapV2Like(data, signer);
            }
            default: {
                throw "Dex not implemented";
            }
        }
    }
    return { spawnDex, chainClass };
}
function getChain(chain) {
    switch (chain) {
        case primitives_1.Chain.mainnet: {
            throw "chain not implemented";
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
            return returnSpawnDexWithFilterAndChainClass([primitives_1.DEXTYPE.SushiV2], cc.polygon);
        }
        case primitives_1.Chain.polygonTest: {
            throw "chain not implemented";
        }
        case primitives_1.Chain.hardhat: {
            return returnSpawnDexWithFilterAndChainClass([primitives_1.DEXTYPE.SushiV2, primitives_1.DEXTYPE.UniswapV2], cc.HardhatLocalNetwork);
        }
        case primitives_1.Chain.bsc: {
            return returnSpawnDexWithFilterAndChainClass([primitives_1.DEXTYPE.pankakeSwapV2], cc.bsc);
        }
        case primitives_1.Chain.bscTest: {
            throw "chain not implementedf";
        }
    }
}
exports.default = getChain;

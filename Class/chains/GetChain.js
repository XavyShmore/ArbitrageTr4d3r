"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const primitives_1 = require("../primitives");
const Chains_1 = require("../Chains");
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
            return returnSpawnDexWithFilterAndChainClass([primitives_1.DEXTYPE.SushiV2], Chains_1.polygon);
        }
        case primitives_1.Chain.polygonTest: {
            throw "chain not implemented";
        }
        case primitives_1.Chain.hardhat: {
            return returnSpawnDexWithFilterAndChainClass([primitives_1.DEXTYPE.SushiV2, primitives_1.DEXTYPE.UniswapV2], Chains_1.HardhatLocalNetwork);
        }
    }
}
exports.default = getChain;

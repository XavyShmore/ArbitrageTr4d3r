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
const Chains_1 = require("../../Chains");
const primitives_1 = require("../../primitives");
const DEX = __importStar(require("./DEX"));
var polygonChainHub = {
    spawnDex(data, signer) {
        switch (data.type) {
            case primitives_1.DEXTYPE.SushiV2: {
                return new DEX.SushiV2(data, signer);
            }
            default: {
                throw "Dex not implemented on this chain";
            }
        }
    },
    chainClass: Chains_1.polygon
};
exports.default = polygonChainHub;

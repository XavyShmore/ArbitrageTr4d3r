"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const testOnlyWallet_1 = __importDefault(require("../Wallet/testOnlyWallet"));
const primitives_1 = require("./primitives");
describe("primitive", () => {
    describe("ChainClass", () => {
        let testNetworkAddress = "http://127.0.0.1:8545/";
        function tests(cc) {
            (0, chai_1.expect)(cc.provider).is.ok;
            (0, chai_1.expect)(cc.signer).is.ok;
            (0, chai_1.expect)(cc.signer.provider).not.be.null;
            (0, chai_1.expect)(cc.chain).is.ok;
            (0, chai_1.expect)(cc.providerAddress).is.ok;
        }
        it("works with set wallet", () => {
            let cc = new primitives_1.ChainClass(testNetworkAddress, primitives_1.Chain.hardhat, testOnlyWallet_1.default);
            tests(cc);
        });
        it("works without set wallet", () => {
            let cc = new primitives_1.ChainClass(testNetworkAddress, primitives_1.Chain.hardhat);
            tests(cc);
        });
    });
});

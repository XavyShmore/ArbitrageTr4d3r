"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const testUtils_1 = __importDefault(require("./testUtils"));
describe("testUtils", () => {
    describe("Accounts", () => {
        it("generate", async () => {
            let signers = await testUtils_1.default.accounts.generate();
            (0, chai_1.expect)(signers.length).to.equal(20);
            signers.forEach((signer) => {
                (0, chai_1.expect)(signer.provider, "Provider not set").ok;
            });
        });
    });
    describe("UniswapV2Like", function () {
        this.timeout(30000);
        it("setUp", async () => {
            let response = await testUtils_1.default.uniswapV2Like.setUp();
            (0, chai_1.expect)(response.factory.functions, "factory isn't deployed properly").ok;
            (0, chai_1.expect)(response.router.functions, "router isn't deployed properly").ok;
        });
        it("generatePairs", async () => {
            let wantedNumberOfParis = 5;
            let response = await testUtils_1.default.uniswapV2Like.generatePairs(wantedNumberOfParis);
            (0, chai_1.expect)(response.length == wantedNumberOfParis, "Something does'nt work").ok;
        });
    });
    describe("Erc20", function () {
        this.timeout(10000);
        it("generateTestToken", async () => {
            let numtoken = 3;
            let initialMint = 20000;
            let decimal = 16;
            let tokens = await testUtils_1.default.erc20.generateTestToken(numtoken, initialMint, decimal);
            (0, chai_1.expect)(tokens.length, `Incorrect number of token produced. Should be: ${numtoken}`).to.equal(numtoken);
            (0, chai_1.expect)(tokens[numtoken - 1].functions, "At least one token is not deployed properly").ok;
            /* To work on
            expect((await tokens[numtoken-1].balanceOf(await tokens[numtoken-1].signer.getAddress())).eq(initialMint),"Initial balance is not properly setup").equal(true);
            expect((await tokens[numtoken-1].decimals()).eq(decimal),"decimals not properly setup").equal(true);
            */
        });
    });
});

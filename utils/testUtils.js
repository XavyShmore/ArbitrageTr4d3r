"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setUpUniswapV2 = exports.generateAccounts = void 0;
const ethers_1 = require("ethers");
const Chains_1 = require("../Class/Chains");
// returns an array with 20 ethers signer for the local test blockchain
async function generateAccounts() {
    let accountsSigner = [];
    let accountDict;
    for (let i = 0; i < 20; i++) {
        accountsSigner.push(Chains_1.HardhatLocalNetwork.provider.getSigner(i));
    }
    accountsSigner.forEach(async (signer) => {
        accountDict[await signer.getAddress()] = signer;
    });
    return await Promise.all(accountsSigner);
}
exports.generateAccounts = generateAccounts;
//set up a uniswap factory and router contract
async function setUpUniswapV2() {
    let signerAddress = await Chains_1.HardhatLocalNetwork.signer.getAddress();
    const compiledFactory = require("@uniswap/v2-core/build/UniswapV2Factory.json");
    let uniswapFactory = await new ethers_1.ethers.ContractFactory(compiledFactory.interface, compiledFactory.bytecode, Chains_1.HardhatLocalNetwork.signer).deploy(signerAddress);
    const compiledUniswapRouter = require("@uniswap/v2-periphery/build/UniswapV2Router02");
    let router = await new ethers_1.ethers.ContractFactory(compiledUniswapRouter.abi, compiledUniswapRouter.bytecode, Chains_1.HardhatLocalNetwork.signer).deploy(uniswapFactory.address, signerAddress);
    return { uniswapFactory, router };
}
exports.setUpUniswapV2 = setUpUniswapV2;

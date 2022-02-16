"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTestERC20 = exports.setUpUniswapV2 = exports.generateAccounts = void 0;
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
//eventually should be set up so it don't always recreate new factory and router # todo
async function setUpUniswapV2() {
    let signerAddress = await Chains_1.HardhatLocalNetwork.signer.getAddress();
    const compiledFactory = require("@uniswap/v2-core/build/UniswapV2Factory.json");
    let uniswapFactory = await new ethers_1.ethers.ContractFactory(compiledFactory.interface, compiledFactory.bytecode, Chains_1.HardhatLocalNetwork.signer).deploy(signerAddress);
    const compiledUniswapRouter = require("@uniswap/v2-periphery/build/UniswapV2Router02");
    let router = await new ethers_1.ethers.ContractFactory(compiledUniswapRouter.abi, compiledUniswapRouter.bytecode, Chains_1.HardhatLocalNetwork.signer).deploy(uniswapFactory.address, signerAddress);
    return { factory: await uniswapFactory.deployed(), router: await router.deployed() };
}
exports.setUpUniswapV2 = setUpUniswapV2;
//create a number of test ERC20 tokens and returns the promise of an array filled with said tokens
async function generateTestERC20(numberToCreate, initialMint = 0, decimal = 18) {
    const compiledERC20 = require("../Ethereum/Ethereum/sources/ERC20.sol/DevToken.json");
    let erc20Factory = new ethers_1.ethers.ContractFactory(compiledERC20.abi, compiledERC20.bytecode, Chains_1.HardhatLocalNetwork.signer);
    let ercArray = [];
    for (var i = 0; i < numberToCreate; i++) {
        ercArray.push(erc20Factory.deploy(`${parseInt(String(initialMint))}`, `Token ${i}`, `${parseInt(String(decimal))}`, `T${i}`));
    }
    return await Promise.all(ercArray.map(async (erc) => {
        return (await erc).deployed();
    }));
}
exports.generateTestERC20 = generateTestERC20;
exports.default = {
    accounts: {
        generate: generateAccounts
    },
    uniswapV2Like: {
        setUp: setUpUniswapV2
    },
    erc20: {
        generateTestToken: generateTestERC20
    }
};
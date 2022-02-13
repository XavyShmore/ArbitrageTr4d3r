"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const Chains_1 = require("../../Class/Chains");
const ethers_1 = require("ethers");
const mocha_1 = require("mocha");
const compiledFactory = require("@uniswap/v2-core/build/UniswapV2Factory.json");
const compiledERC20 = require("../../Ethereum/Ethereum/sources/ERC20.sol/Token.json");
const numberOfP = 3; // integer between 1 and 20 Going higher than 7 might require to raise timeout
let UniV2Factory;
let accounts = [];
let tokens = [];
let accountAddresses;
(0, mocha_1.before)(async () => {
    for (let i = 0; i < numberOfP; i++) {
        accounts.push(Chains_1.HardhatLocalNetwork.provider.getSigner(i));
    }
    let accountsAddressPromise = accounts.map((account) => {
        return account.getAddress();
    });
    accountAddresses = await Promise.all(accountsAddressPromise);
});
describe("Uniswap V2", function () {
    this.timeout(8000);
    it("Deployed Uniswap V2 Factory", async () => {
        UniV2Factory = await new ethers_1.ethers.ContractFactory(compiledFactory.interface, compiledFactory.bytecode, accounts[0]).deploy(accountAddresses[0]);
        (0, chai_1.expect)(await UniV2Factory.deployed()).is.ok;
    });
    it("Deploys 1 ERC20 Contract for each accounts with 1,000,000,000 tokens to the contract creator", async () => {
        let Contracts = [];
        accounts.forEach(async (account) => {
            let contract = new ethers_1.ethers.ContractFactory(compiledERC20.abi, compiledERC20.bytecode, accounts[0]);
            Contracts.push(contract.deploy("1000000000", "Token: ", "3", "T"));
        });
        tokens = await Promise.all(Contracts.map(async (contract) => {
            return (await contract).deployed();
        }));
        for (let i = 0; i < numberOfP; i++) {
            (0, chai_1.expect)(tokens[i], "not all contract have deployed correctly").is.ok;
        }
    });
    it("Every accounts sends 100,000,000 tokens to every accounts", async function () {
        return new Promise(async (resolve, reject) => {
            try {
                let tsxResponsePromises = [];
                tokens.forEach((token) => {
                    accountAddresses.forEach((accountAddress) => {
                        let tsxResponsePromise = token.transfer(accountAddress, "100000000");
                        tsxResponsePromises.push(tsxResponsePromise);
                    });
                });
                await Promise.all(tsxResponsePromises.map(async (tsxResponsePromise) => {
                    return await (await tsxResponsePromise).wait();
                }));
                var tokenOk = 0;
                var updateTokenOk = () => {
                    tokenOk++;
                    if (tokenOk >= tokens.length) {
                        resolve();
                    }
                };
                tokens.forEach((token) => {
                    var accountOk = 0;
                    var updateAccountOk = () => {
                        accountOk++;
                        if (accountOk >= accounts.length) {
                            updateTokenOk();
                        }
                    };
                    accounts.forEach(async (account) => {
                        var balance = await token.balanceOf(await account.getAddress());
                        (0, chai_1.expect)(balance.gte(100000000)).to.be.true;
                        updateAccountOk();
                    });
                });
            }
            catch (err) {
                reject(err);
            }
        });
    });
});

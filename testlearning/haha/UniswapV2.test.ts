import { expect } from "chai";
import {HardhatLocalNetwork as hdhn} from "../../Class/Chains";
import { Contract, ethers,Signer, utils } from "ethers";
//import { before } from "mocha";

const compiledFactory:any = require("@uniswap/v2-core/build/UniswapV2Factory.json");
const compiledERC20:any = require("../../Ethereum/Ethereum/sources/ERC20.sol/DevToken.json");

const numberOfP:number = 3; // integer between 1 and 20 Going higher than 7 might require to raise timeout

let UniV2Factory:Contract
let accounts:Signer[] = []
let tokens:Contract[] = []
let accountAddresses:string[];

before(async()=>{
    for(let i = 0; i<numberOfP; i++){
        accounts.push(hdhn.provider.getSigner(i))
    }
    let accountsAddressPromise = accounts.map((account)=>{
        return account.getAddress();
    });
    accountAddresses = await Promise.all(accountsAddressPromise);
});

describe("Uniswap V2", function () {
    this.timeout(8000);
    it("Deployed Uniswap V2 Factory", async ()=>{
        UniV2Factory = await new ethers.ContractFactory(compiledFactory.interface,compiledFactory.bytecode,accounts[0]).deploy(accountAddresses[0]);
        expect(await UniV2Factory.deployed()).is.ok;
    });
    
    it("Deploys 1 ERC20 Contract for each accounts with 1,000,000,000 tokens to the contract creator",async()=>{ // only check if contract is submited
        
        let Contracts: Promise<Contract>[] = [];

        accounts.forEach(async(account)=>{
            let contract = new ethers.ContractFactory(compiledERC20.abi,compiledERC20.bytecode,accounts[0]);
            Contracts.push(contract.deploy("1000000000","Token: ", "3", "T"));
        });

        tokens = await Promise.all(Contracts.map(async(contract)=>{
            return (await contract).deployed();
        }));
        
        for (let i = 0; i<numberOfP; i++){
            expect(tokens[i],"not all contract have deployed correctly").is.ok;
        }
    });
    it("Every accounts sends 100,000,000 tokens to every accounts", async function (){
        return new Promise(async (resolve,reject) => {
            try{
                let tsxResponsePromises:Promise<any>[] = [];
                
                tokens.forEach((token)=>{
                    accountAddresses.forEach((accountAddress)=>{
                        let tsxResponsePromise = token.transfer( accountAddress,"100000000");
                        tsxResponsePromises.push(tsxResponsePromise);
                    });
                });

                await Promise.all(tsxResponsePromises.map(async(tsxResponsePromise)=>{
                    return await (await tsxResponsePromise).wait()
                }));

                var tokenOk = 0;
                var updateTokenOk = ()=>{
                    tokenOk++;
                    if(tokenOk >= tokens.length){
                        resolve();
                    }
                }

                tokens.forEach((token)=>{
                    var accountOk = 0;
                    var updateAccountOk = ()=>{
                        accountOk ++;
                        if(accountOk >=accounts.length){
                            updateTokenOk();
                        }
                    }
                    accounts.forEach(async(account)=>{
                        var balance:ethers.BigNumber = await token.balanceOf(await account.getAddress());
                        expect(balance.gte(100000000)).to.be.true;
                        updateAccountOk();
                    });
                });

            }catch(err){
                reject(err);
            }
        });
    });
});
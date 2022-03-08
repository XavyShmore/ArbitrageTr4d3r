import { TransactionResponse } from "@ethersproject/abstract-provider";
import { Contract, ethers, Signer, Transaction } from "ethers";
import {HardhatLocalNetwork as hdhn} from "../Class/Chains";
import { Chain, DEXData, DEXTYPE } from "../Class/primitives";

// returns an array with 20 ethers signer for the local test blockchain
export async function generateAccounts(){ 
    let accountsSigner = [];
    let accountDict:{[addresses:string]:Signer} = {};
    for(let i = 0; i<20; i++){
        accountsSigner.push(hdhn.provider.getSigner(i))
    }
    accountsSigner.forEach(async (signer) => {
        accountDict[await signer.getAddress()] = signer;
    });
    return await Promise.all(accountsSigner);
}
//set up a uniswap factory and router contract
        //eventually should be set up so it don't always recreate new factory and router # todo
export async function setUpUniswapV2(){
    let signerAddress = await hdhn.signer.getAddress()
    const compiledFactory:any = require("@uniswap/v2-core/build/UniswapV2Factory.json");
    let uniswapFactory:Contract = await new ethers.ContractFactory(compiledFactory.interface,compiledFactory.bytecode, hdhn.signer).deploy(signerAddress);
    const compiledUniswapRouter = require("@uniswap/v2-periphery/build/UniswapV2Router02");
    let router:Contract = await new ethers.ContractFactory(compiledUniswapRouter.abi,compiledUniswapRouter.bytecode,hdhn.signer).deploy(uniswapFactory.address,signerAddress);

    //console.log(`Uniswap Factory adddress: ${uniswapFactory.address}, router address: ${router.address}`);

    return {factory: await uniswapFactory.deployed(),router:await router.deployed()};
}
//generate a number of uniswap pair with the given tokens
async function generatePairs(numOfPair:number, uniswapContracts?:{factory:Contract, router:Contract}, tokens?:Contract[]){
    async function _generatePairs(_numOfPair:number, _uniswapContracts:{factory:Contract, router:Contract}, _tokens:Contract[]):Promise<DEXData[]> {
        return new Promise(async(resolve,reject)=>{
            if((1+((1+8*numOfPair)**(0.5)))/2>_tokens.length) {
                reject("Need more token to generate this number of token");
            }
            let pairArray:DEXData[] = [];
            let numOfTokensPerPair = 1000000000;
            let signerAddress = await hdhn.signer.getAddress();
            let tx:Promise<TransactionResponse>;

            _tokens.forEach((token)=>{
                let value = numOfTokensPerPair*(_tokens.length);
                token.mint(signerAddress,value);
                tx = token.approve(_uniswapContracts.router.address,value);
            });

            _uniswapContracts.factory.on("PairCreated",async(t0Address:string,t1Address:string,pairAddress:string)=>{
                let data:DEXData = {
                    address:pairAddress,
                    token0:t0Address,
                    token1:t1Address,
                    chain:Chain.hardhat,
                    token0Amount:numOfTokensPerPair,
                    token1Amount:numOfTokensPerPair,
                    type:DEXTYPE.SushiV2
                }
                pairArray.push(data);
                if(pairArray.length == numOfPair){
                    resolve(pairArray);
                }
            });

            await (await tx).wait();

            for(let i = 0; i<(_tokens.length-1);i++){
                for(let j = i+1; j <_tokens.length;j++){
                    tx = await _uniswapContracts.router.addLiquidity(_tokens[i].address,_tokens[j].address,numOfTokensPerPair.toString(),numOfTokensPerPair.toString(),(numOfTokensPerPair-numOfTokensPerPair*0.15).toString(),(numOfTokensPerPair-numOfTokensPerPair*0.15).toString(),signerAddress,(Date.now()+10000).toString());
                }
            }
        });
    }
    return _generatePairs(
        numOfPair,
        typeof uniswapContracts !== 'undefined'?
            uniswapContracts:
            await setUpUniswapV2(),
        typeof tokens !== 'undefined'?
            tokens:
            await generateTestERC20(Math.ceil((1+((1+8*numOfPair)**(0.5)))/2)) //generateTestERC20:generate the min amount of token to get n pair (isolate n in the formula n*(n-1)/2)
    );
}

//create a number of test ERC20 tokens and returns the promise of an array filled with said tokens
export async function generateTestERC20 (numberToCreate:number, initialMint:number = 0,decimal:number = 18) {
    const compiledERC20 = require("../Ethereum/Ethereum/sources/ERC20.sol/DevToken.json");
    let erc20Factory = new ethers.ContractFactory(compiledERC20.abi,compiledERC20.bytecode,hdhn.signer);

    let ercArray:Promise<Contract>[] = [];

    for(var i = 0; i<numberToCreate;i++){
        ercArray.push(erc20Factory.deploy(`${parseInt(String(initialMint))}`, `Token ${i}`, `${parseInt(String(decimal))}`, `T${i}`))
    }

    return await Promise.all(ercArray.map(async(erc)=>{
        return (await erc).deployed();
    }));
}
export default {
    accounts : {
        generate:generateAccounts
    },
    uniswapV2Like:{
        setUp : setUpUniswapV2,
        generatePairs:generatePairs
    },
    erc20:{
        generateTestToken:generateTestERC20
    }
}
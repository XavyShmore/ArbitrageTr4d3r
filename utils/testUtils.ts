import { Contract, ethers, Signer } from "ethers";
import {HardhatLocalNetwork as hdhn} from "../Class/Chains";

// returns an array with 20 ethers signer for the local test blockchain
export async function generateAccounts(){ 
    let accountsSigner = [];
    let accountDict:{[addresses:string]:Signer};
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

    return {factory: await uniswapFactory.deployed(),router:await router.deployed()};
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
        setUp : setUpUniswapV2
    },
    erc20:{
        generateTestToken:generateTestERC20
    }
}
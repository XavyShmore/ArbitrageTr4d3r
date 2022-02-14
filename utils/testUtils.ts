import { ethers, Signer } from "ethers";
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
export async function setUpUniswapV2(){
    let signerAddress = await hdhn.signer.getAddress()
    const compiledFactory:any = require("@uniswap/v2-core/build/UniswapV2Factory.json");
    let uniswapFactory = await new ethers.ContractFactory(compiledFactory.interface,compiledFactory.bytecode, hdhn.signer).deploy(signerAddress);
    const compiledUniswapRouter = require("@uniswap/v2-periphery/build/UniswapV2Router02");
    let router = await new ethers.ContractFactory(compiledUniswapRouter.abi,compiledUniswapRouter.bytecode,hdhn.signer).deploy(uniswapFactory.address,signerAddress);

    return {uniswapFactory,router};
}
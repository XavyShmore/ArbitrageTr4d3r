import { DEXData,ChainClass, Dex, priceUpdate } from "../../../Class/primitives";
import getChain from "../../../Class/chains/GetChain";
import { ethers } from "ethers";

async function start(chain:ChainClass, dex:{[addresses:string]:DEXData},updateListener:Function) {

    var activeDex:{[addresses:string]:Dex} = {};

    //Initialise the provider
    var activeChain = chain;


    //Fill active Dex
    for(var [address, dexEntrie] of Object.entries(dex)){
        var exchange:Dex = getChain(activeChain.chain).spawnDex(dexEntrie,activeChain.signer);
        activeDex[address.toLocaleLowerCase()] = exchange;
    }

    async function updateEverything(exchanges:{[addresses:string]:Dex},changedDex:string[]){
        const priceUpdateArray:Promise<priceUpdate>[] = [];
        var test = 0;
        changedDex.forEach((address)=>{
            priceUpdateArray.push(exchanges[address].update())
            test ++;
        }); 
        return await Promise.all(priceUpdateArray);
    }

    let updateArray = await updateEverything(activeDex,Object.keys(activeDex));
    if(updateArray.length > 0){
        updateListener(activeChain.provider.blockNumber, updateArray);
    }


    let topic0 = [ethers.utils.id("Swap(address,uint256,uint256,uint256,uint256,address)"),ethers.utils.id("Mint(address,uint256, uint256)"),ethers.utils.id("Burn(address,uint256, uint256)")];


    //Start update on every new block
    activeChain.provider.on("block",async (blockHeight)=>{

        
        let filter:ethers.providers.Filter ={
            
            topics:[
                topic0
            ],
            fromBlock:blockHeight,
            toBlock:blockHeight
        }

        let logs = await activeChain.provider.getLogs(filter);
        
        let changedDex:string[] = [];
        logs.forEach((log)=>{
            let address = log.address.toLocaleLowerCase();
            if(Object.keys(activeDex).includes(address)){
                changedDex.push(address);
            }
        });

        let updateArray = await updateEverything(activeDex,changedDex); 
        if(updateArray.length > 0){
            updateListener(blockHeight, updateArray);
        }
    });
}
export default {
    start:start
};
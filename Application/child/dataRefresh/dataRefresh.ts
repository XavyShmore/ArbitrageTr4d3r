import { DEXData,ChainClass, Dex } from "../../../Class/primitives";
import getChain from "../../../Class/chains/GetChain";

async function start(chain:ChainClass, dex:{[addresses:string]:DEXData},updateListener:Function) {

    var activeDex:{[addresses:string]:Dex} = {};

    //Initialise the provider
    var activeChain = chain;

    //Fill active Dex
    for(const [address, dexEntrie] of Object.entries(dex)){
        var exchange:Dex = getChain(activeChain.chain).spawnDex(dexEntrie,activeChain.signer);
        activeDex[address] = exchange;
    }

    async function updateEverything(exchanges:{[addresses:string]:Dex}){
        const priceUpdateArray = await Promise.all(Object.values(exchanges).map(exchange => exchange.update()));
        const cleanedUpdateArray = []
        for(var i =0; i <priceUpdateArray.length; i++){
            if(priceUpdateArray[i].hasChangedSinceLastUpdate){
                cleanedUpdateArray.push(priceUpdateArray[i]);
            }
        }
        return cleanedUpdateArray;
    }

    updateListener(activeChain.provider.blockNumber, await updateEverything(activeDex))

    //Start update on every new block
    activeChain.provider.on("block",async (blockHeight)=>{
        updateListener(blockHeight, await updateEverything(activeDex));
    });
}
export default start;
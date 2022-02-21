import { Chain as c, ChainHub,DEXTYPE as d,DEXData, Dex, ChainClass } from "../primitives";
import { Signer } from "ethers";
import { HardhatLocalNetwork as hdhn,polygon } from "../Chains";
import { uniswapV2Like } from "../mainDex/mainDex";


function returnSpawnDexWithFilterAndChainClass(supportedDex:d[],chainClass:ChainClass){
    function spawnDex(data:DEXData,signer:Signer):Dex{
        if(!(data.type in supportedDex)){
            throw new Error("This dex is not supported on this chain");
        }
        switch (data.type){
            case d.SushiV2:{
                return new uniswapV2Like(data,signer);
            }case d.UniswapV2:{
                return new uniswapV2Like(data,signer);
            }
            default:{
                throw"Dex not implemented";
            }
        }
    }
    return {spawnDex,chainClass};
}

export default function getChain (chain:c):ChainHub {
    switch(chain){
        case c.mainnet:{
            throw "chain not implemented";
        }case c.ropsten:{
            throw "chain not implemented";
        }case c.goerli:{
            throw "chain not implemented";
        }case c.rinkeby:{
            throw "chain not implemented";
        }case c.polygon:{
            return returnSpawnDexWithFilterAndChainClass([d.SushiV2],polygon);
        }case c.polygonTest:{
            throw "chain not implemented";
        }case c.hardhat:{
            return returnSpawnDexWithFilterAndChainClass([d.SushiV2,d.UniswapV2],hdhn);
        }
    }
}
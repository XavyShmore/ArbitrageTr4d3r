import { Chain as c, ChainHub,DEXTYPE as d,DEXData, Dex, ChainClass, DEXTYPE } from "../primitives";
import { Signer } from "ethers";
import * as cc from "../Chains";
import { uniswapV2Like } from "../mainDex/mainDex";


function returnSpawnDexWithFilterAndChainClass(supportedDex:d[],chainClass:ChainClass){
    function spawnDex(data:DEXData,signer:Signer):Dex{
        if(!(supportedDex.includes(data.type))){
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
            return returnSpawnDexWithFilterAndChainClass([d.SushiV2],cc.polygon);
        }case c.polygonTest:{
            throw "chain not implemented";
        }case c.hardhat:{
            return returnSpawnDexWithFilterAndChainClass([d.SushiV2,d.UniswapV2],cc.HardhatLocalNetwork);
        }case c.bsc:{
            return returnSpawnDexWithFilterAndChainClass([d.pankakeSwapV2],cc.bsc);
        }case c.bscTest:{
            throw "chain not implementedf";
        }
    }
}
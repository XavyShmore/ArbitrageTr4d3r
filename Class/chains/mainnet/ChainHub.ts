import { Signer } from "ethers";
import { mainnet } from "../../Chains";
import { Chain, ChainHub, Dex, DEXData, DEXTYPE } from "../../primitives";
//import * as DEX from"./DEX";

var mainnetChainHub:ChainHub = {
    spawnDex(data:DEXData,signer:Signer):Dex{
        switch (data.type){
            default:{
                throw"Dex not implemented on this chain";
            }
        }
    },
    chainClass:mainnet
}
export default mainnetChainHub;
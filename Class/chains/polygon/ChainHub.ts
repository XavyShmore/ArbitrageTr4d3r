import { Signer } from "ethers";
import { polygon } from "../../Chains";
import { ChainHub, DEXData, DEXTYPE } from "../../primitives";
import * as DEX from"./DEX";

var polygonChainHub:ChainHub = {
    spawnDex(data:DEXData,signer:Signer){
        switch (data.type){
            case DEXTYPE.SushiV2:{
                return new DEX.SushiV2(data,signer);
            }
            default:{
                throw"Dex not implemented on this chain";
            }
        }
    },
    chainClass:polygon
}

export default polygonChainHub
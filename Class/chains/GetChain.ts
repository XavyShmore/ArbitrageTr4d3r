import { Chain, ChainHub } from "../primitives";

import mainnetChainHub from "./mainnet/ChainHub";
import polygonChainHub from "./polygon/ChainHub";

export default function getChain (chain:Chain):ChainHub {
    switch(chain){
        case Chain.mainnet:{
            return mainnetChainHub;
        }case Chain.ropsten:{
            throw "chain not implemented";
        }case Chain.goerli:{
            throw "chain not implemented";
        }case Chain.rinkeby:{
            throw "chain not implemented";
        }case Chain.polygon:{
            return polygonChainHub;
        }case Chain.polygonTest:{
            throw "chain not implemented";
        }case Chain.hardhat:{
            throw "chain not implemented";
        }
    }
}
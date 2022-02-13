import { fork,ForkOptions } from "child_process";// not used
import path from "path";
import getChain from "../../Class/chains/GetChain";
import { Chain, Dex, priceUpdate } from "../../Class/primitives";
import start  from "../child/dataRefresh/dataRefresh";


const calculatorScript = path.resolve("../child/calculator/calculator");
const calcOptions:ForkOptions = {
    stdio:["pipe","pipe","pipe","ipc"]
}
//const calculator = fork(calculatorScript,calcOptions)


var workingChain:Chain;
var followedDex:{[address:string]:Dex} = {};

function startListening(chain :Chain, dex:{[address:string]:Dex}){
    workingChain = chain;
    start(getChain(chain).chainClass,dex, listenerCallback);

    function listenerCallback(priceUpdate:priceUpdate){
        
    }

}
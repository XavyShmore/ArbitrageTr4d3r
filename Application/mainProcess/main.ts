//import { fork,ForkOptions } from "child_process";// not used
//import path from "path";
import { bsc } from "../../Class/Chains";
//import getChain from "../../Class/chains/GetChain";
import { Chain, Dex, DEXData, DEXTYPE, priceUpdate } from "../../Class/primitives";
import dataRefresh  from "../child/dataRefresh/dataRefresh";

/*
const calculatorScript = path.resolve("../child/calculator/calculator");
const calcOptions:ForkOptions = {
    stdio:["pipe","pipe","pipe","ipc"]
}
//const calculator = fork(calculatorScript,calcOptions)
*/
var workingChain:Chain;
var followedDex:{[address:string]:DEXData} = {
    "0x0eD7e52944161450477ee417DE9Cd3a859b14fD0":{
        name:"Pancake WBNB/CAKE",
        address:"0x0eD7e52944161450477ee417DE9Cd3a859b14fD0",
        chain:Chain.bsc,
        token0:"0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
        token1:"0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82",
        type:DEXTYPE.pankakeSwapV2,
        token0Amount:1,
        token1Amount:1,
    },
    "0x58F876857a02D6762E0101bb5C46A8c1ED44Dc16":{
        name:"Pancake WBNB/BUSD",
        address:"0x58F876857a02D6762E0101bb5C46A8c1ED44Dc16",
        chain:Chain.bsc,
        token0:"0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
        token1:"0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
        type:DEXTYPE.pankakeSwapV2,
        token0Amount:1,
        token1Amount:1,
    },
    "0x16b9a82891338f9bA80E2D6970FddA79D1eb0daE":{
        name:"Pancake WBNB/USDT",
        address:"0x16b9a82891338f9bA80E2D6970FddA79D1eb0daE",
        chain:Chain.bsc,
        token0:"0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
        token1:"0x55d398326f99059fF775485246999027B3197955",
        type:DEXTYPE.pankakeSwapV2,
        token0Amount:1,
        token1Amount:1,
    },
    "0x804678fa97d91B974ec2af3c843270886528a9E6":{
        name:"Pancake CAKE/BUSD",
        address:"0x804678fa97d91B974ec2af3c843270886528a9E6",
        chain:Chain.bsc,
        token0:"0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82",
        token1:"0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
        type:DEXTYPE.pankakeSwapV2,
        token0Amount:1,
        token1Amount:1,
    },
    "0xf5d9b8947b11ddf5ee33374cc2865e775ebe00dc":{
        name:"Pancake WBNB/SAFUU",
        address:"0xf5d9b8947b11ddf5ee33374cc2865e775ebe00dc",
        chain:Chain.bsc,
        token0:"0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
        token1:"0xe5ba47fd94cb645ba4119222e34fb33f59c7cd90",
        type:DEXTYPE.pankakeSwapV2,
        token0Amount:1,
        token1Amount:1,
    },
    "0x7EFaEf62fDdCCa950418312c6C91Aef321375A00":{
        name:"Pancake USDT/BUSD",
        address:"0x7EFaEf62fDdCCa950418312c6C91Aef321375A00",
        chain:Chain.bsc,
        token0:"0x55d398326f99059fF775485246999027B3197955",
        token1:"0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
        type:DEXTYPE.pankakeSwapV2,
        token0Amount:1,
        token1Amount:1,
    }
};

function turnAddressToLowerCase (dexInfo:{[address:string]:DEXData}):{[address:string]:DEXData}{
    let returnAddress:{[address:string]:DEXData} = {}

    Object.keys(dexInfo).forEach((address)=>{

        let dexInfoEntry = dexInfo[address];

        returnAddress[address.toLocaleLowerCase()] = dexInfoEntry;
        returnAddress[address.toLocaleLowerCase()].address = address.toLocaleLowerCase();
        returnAddress[address.toLocaleLowerCase()].token0 = dexInfoEntry.token0.toLocaleLowerCase();
        returnAddress[address.toLocaleLowerCase()].token1 = dexInfoEntry.token1.toLocaleLowerCase();
    });

    return returnAddress
}

followedDex = turnAddressToLowerCase(followedDex);


/*
function startListening(chain :Chain, dex:{[address:string]:Dex}){
    workingChain = chain;
    start(getChain(chain).chainClass,dex, listenerCallback);

    function listenerCallback(priceUpdate:priceUpdate){
        
    }
}*/

function updateListener(block_number:number,updateArray:priceUpdate[]){
    console.log(`Update at Block: ${block_number}`);
    updateArray.forEach((update)=>{
        console.log(`   ${followedDex[update.dexAddress].name} has a new price: ${update.t0InstantPrice}`);
    });
}

function start(){
    setInterval(()=>{
        console.log(`[${new Date().getHours()}h ${new Date().getMinutes()}min ${new Date().getSeconds()}s]      Still watching bsc`)
    },10000);
    dataRefresh.start(bsc, followedDex,updateListener);
}

start();
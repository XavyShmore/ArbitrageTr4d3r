import {ChainClass, Chain} from "./primitives";
import testWallet from "../Wallet/testOnlyWallet";

//export var mainnet = new ChainClass("To be implemented",Chain.mainnet,testWallet);//Address to be implemented
export var rinkeby = new ChainClass("wss://speedy-nodes-nyc.moralis.io/308f12c1587841bd314d6066/eth/rinkeby/ws",Chain.rinkeby,testWallet);
export var goerli = new ChainClass("wss://speedy-nodes-nyc.moralis.io/308f12c1587841bd314d6066/eth/goerli/ws",Chain.goerli,testWallet);

export var polygon = new ChainClass("wss://speedy-nodes-nyc.moralis.io/308f12c1587841bd314d6066/polygon/mainnet/ws",Chain.polygon, testWallet);
export var polygonTest = new ChainClass("wss://speedy-nodes-nyc.moralis.io/308f12c1587841bd314d6066/polygon/mumbai/ws",Chain.polygonTest,testWallet); // Mumbai

export var bsc = new ChainClass("https://bsc-dataseed.binance.org/",Chain.bsc,testWallet);
//export var bscTest = new ChainClass("",Chain.bscTest,testWallet);

export var HardhatLocalNetwork = new ChainClass("http://127.0.0.1:8545/",Chain.hardhat);
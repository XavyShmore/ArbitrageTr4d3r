import fs from "fs-extra"
import { ethers,Signer,Contract, Wallet} from "ethers"
import testWallet from "../Wallet/testOnlyWallet"

export enum Chain{
    mainnet = 1,
    ropsten = 3,
    rinkeby = 4,
    goerli = 5,
    polygon = 137,
    polygonTest = 80001, 
    hardhat = 31337,
}

export type TokenMetaData = {
    address: string;
    chain:Chain;

    contractFctGas:{[name:string]:number|null}

    name: string | null;
    symbol:string|null;
    decimals: string | null;
    logo: string | null;
    logo_hash: string | null;
    thumbnail: string | null;
    block_number: string | null;
    validated: number | null;
}

export function emptyTokenMetaData(adddress:string, chain:Chain = Chain.mainnet):TokenMetaData{
    var a: TokenMetaData = {
        address:adddress,
        chain:chain,

        contractFctGas:{},
        
        name:null,
        symbol:null,
        decimals:null,
        logo:null,
        logo_hash:null,
        thumbnail:null,
        block_number:null,
        validated:null
    }
     return a
} 

export class Token{
    
    metadata:TokenMetaData

    constructor(tokenMetadata:TokenMetaData){
        this.metadata = tokenMetadata
    }
}

export enum DEXTYPE{
    UniswapV2 = "UNI-V2",
    SushiV2 = "Sushi-V2"
}

export type DEXData={
    address:string;

    chain:Chain;

    token0:string;
    token1:string;

    token0Amount:ethers.BigNumberish;
    token1Amount:ethers.BigNumberish;

    type:DEXTYPE;

    lastTSX?:number;
    
    name?:string;
    cote?:string;
}

export abstract class Dex implements DEXData{
    address: string;
    chain: Chain;
    token0: string;
    token1: string;
    token0Amount: ethers.BigNumberish;
    token1Amount: ethers.BigNumberish;
    type: DEXTYPE;
    lastTSX: number | undefined;
    name?: string | undefined;
    cote?: string | undefined;
    //ready:boolean = false;

    abstract contract:Contract;

    constructor(data:DEXData,Signer:ethers.Signer){
        this.address = data.address.toLowerCase();
        this.chain= data.chain;
        this.token0Amount = data.token0Amount;
        this.token1Amount = data.token1Amount;
        this.token0 = data.token0.toLowerCase();
        this.token1 = data.token1.toLowerCase();
        this.type = data.type;

        this.name = data.name;
        this.cote = data.cote;
        this.lastTSX = data.lastTSX;
    }

    abstract update(): Promise<priceUpdate>
    // abstract listenToUpdates(callback:Function):void;

    abstract t1InstantPrice():ethers.BigNumber;
    abstract t0InstantPrice():ethers.BigNumber;

    _lastT0InstantPrice:ethers.BigNumber = ethers.BigNumber.from(0);
    
    getPriceUpdate():priceUpdate{
        return {
            dexAddress:this.address,
            token0Address:this.token0,
            token1Address:this.token1,
            t1InstantPrice:this.t1InstantPrice(),
            t0InstantPrice:this.t0InstantPrice()
        }
    }
}
/*
export abstract class DEX {

    data:DEXData

    private _t0RateInt1: number
    get t0RateInt1():number{
        return this._t0RateInt1
    }
    set t0RateInt1(value:number){
        this._t0RateInt1 = value
    }

    constructor(data:DEXData) {

        this.data = data

        this._t0RateInt1 = 1
        if(typeof data.token0Amount != 'undefined' && typeof data.token1Amount != 'undefined'){
            this.t0RateInt1 = data.token1Amount/data.token0Amount
        }
    }

    async update(){

    }

    getRate (denominatedIn:number):number {
        if (denominatedIn == 1){
            return this.t0RateInt1
        }
        else{
            return 1/this.t0RateInt1
        }
    }

    saveData(){ // slow
        var defaultPath:string = `${process.cwd()}/data/DEX.json`;

        var inputData:{[chain in Chain]:{[address:string]:DEXData}}

        inputData = fs.readJsonSync(defaultPath)
        inputData[this.data.chain][this.data.address] = this.data
    }

}
*/
export type ChainData = {
    providerAddress:string,
    provider:ethers.providers.Provider,
    signer:Signer,
    chain:Chain,
    chainID?:number,

    getBlockHeight():Promise<number>
}
export class ChainClass implements ChainData{
    providerAddress: string;
    provider: ethers.providers.JsonRpcBatchProvider;
    signer: ethers.Signer;
    chain: Chain;
    chainID?:number;
    #wallet?:Wallet
    constructor(providerAddress:string,chain:Chain, wallet?:ethers.Wallet){

        this.providerAddress=providerAddress;
        this.provider = new StaticJsonRpcBatchProvider(this.providerAddress);

        this.#wallet = wallet

        if (this.#wallet){
            this.#wallet.connect(this.provider);
            this.signer = this.#wallet;
        }else{
            this.signer = this.provider.getSigner();
        }
        this.chain = chain
    }
    getBlockHeight(): Promise<number> {
        return this.provider.getBlockNumber();
    }
}

export class StaticJsonRpcBatchProvider extends ethers.providers.JsonRpcBatchProvider{
    async getNetwork(): Promise<ethers.providers.Network> {
        if (this._network) { return Promise.resolve(this._network); }
        return super.getNetwork();
    }
}

export interface ChainHub{
    spawnDex(data:DEXData,signer:ethers.Signer):Dex,
    chainClass:ChainClass,
}
export interface priceUpdate{
    dexAddress:string,
    token0Address:string,
    token1Address:string,
    t1InstantPrice:ethers.BigNumber,
    t0InstantPrice:ethers.BigNumber
}
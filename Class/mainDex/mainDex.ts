import {Chain, DEXData,DEXTYPE,Dex } from "../primitives";
import { Contract, ethers } from "ethers";

const uniswapV2InterFace = require("@uniswap/v2-core/build/IUniswapV2Pair");

export class uniswapV2Like extends Dex{
    
    contract: Contract;

    constructor(data: DEXData, Signer:ethers.Signer){
        super(data,Signer);
        this.contract = new Contract(this.address, new ethers.utils.Interface(uniswapV2InterFace.abi),Signer);

        if(this.token0Amount == 0 || this.token1Amount ==0){
            throw "Dex cannot have a token with 0 of value";
        }

        //make sure smallest address is token0
        if(ethers.BigNumber.from(this.token0).gt(this.token1)){
            var placeHolder:string;
            var placeHolder2:ethers.BigNumberish;

            //switch addresses 
            placeHolder = this.token1;
            this.token1 = this.token0;
            this.token0 = placeHolder;

            //switch amounts
            placeHolder2 = this.token1Amount;
            this.token1Amount = this.token0Amount;
            this.token0Amount=placeHolder2
        }
    }

    async update() {
        var _update = async () => {
            var reservesData = await this.contract.getReserves();

            this.token0Amount = reservesData.reserve0;
            this.token1Amount = reservesData.reserve1;
        }
        this._lastT0InstantPrice = this.t0InstantPrice();
        
        await _update();
        
        return this.getPriceUpdate()
    }

    //Need better implementation to be safe Ex: a way to stop it
    /*
    listenToUpdates(callback: Function): void {
        var swap = this.contract.filters.Swap();
        var mint = this.contract.filters.Mint();
        var burn = this.contract.filters.Burn();

        var _update = async () => {
            await this.update();
            callback(this.getPriceUpdate());
        }

        this.contract.on(swap,()=>{
            _update();
        });
        this.contract.on(mint,()=>{
            _update();
        });this.contract.on(burn,()=>{
            _update();
        });
    }*/

    //(token0Amount/token1Amount)/0.97
    t1InstantPrice(){
        return ethers.BigNumber.from(this.token0Amount).div(this.token1Amount).mul(100).div(97);
    }
    //(token1Amount/token0Amount)/0.97
    t0InstantPrice(){
        return ethers.BigNumber.from(this.token1Amount).div(this.token0Amount).mul(100).div(97);
    }
}
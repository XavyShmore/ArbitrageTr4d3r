"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SushiV2 = void 0;
const mainDex_1 = require("../../mainDex");
/*
export class UniV2{

    private _token0Amount:number
    get token0Amount(){
        return this._token0Amount
    }
    set token0Amount(value:number){
        this._token0Amount = value
        this.data.token0Amount = value
    }

    private _token1Amount:number
    get token1Amount(){
        return this._token1Amount
    }
    set token1Amount(value:number){
        this._token1Amount = value
        this.data.token1Amount = value
    }

    constructor(data:DEXData){
        super(data);

        this.data.type = DEXTYPE.UniswapV2;

        if(typeof data.token0Amount != 'undefined' && typeof data.token1Amount != 'undefined'){
            this._token0Amount = data.token0Amount;
            this._token1Amount = data.token1Amount;
        }else{
            this._token0Amount = 1;
            this._token1Amount = 1;
        }
        
    }

    get t0RateInt1():number{
        return this.token0Amount/this.token1Amount
    }
    set t0RateInt(value:number){ //shoudnt be used
        this.token0Amount = this.token1Amount * value
    }
}
*/
class SushiV2 extends mainDex_1.uniswapV2Like {
}
exports.SushiV2 = SushiV2;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uniswapV2Like = void 0;
const primitives_1 = require("../primitives");
const ethers_1 = require("ethers");
const uniswapV2InterFace = require("@uniswap/v2-core/build/IUniswapV2Pair");
class uniswapV2Like extends primitives_1.Dex {
    constructor(data, Signer) {
        super(data, Signer);
        this.contract = new ethers_1.Contract(this.address, new ethers_1.ethers.utils.Interface(uniswapV2InterFace.abi), Signer);
        if (this.token0Amount == 0 || this.token1Amount == 0) {
            throw "Dex cannot have a token with 0 of value";
        }
        //make sure smallest address is token0
        if (ethers_1.ethers.BigNumber.from(this.token0).gt(this.token1)) {
            var placeHolder;
            var placeHolder2;
            //switch addresses 
            placeHolder = this.token1;
            this.token1 = this.token0;
            this.token0 = placeHolder;
            //switch amounts
            placeHolder2 = this.token1Amount;
            this.token1Amount = this.token0Amount;
            this.token0Amount = placeHolder2;
        }
    }
    async update() {
        var _update = async () => {
            var reservesData = await this.contract.getReserves();
            this.token0Amount = reservesData.reserve0;
            this.token1Amount = reservesData.reserve1;
        };
        this._lastT0InstantPrice = this.t0InstantPrice();
        await _update();
        return this.getPriceUpdate();
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
    t1InstantPrice() {
        return ethers_1.ethers.BigNumber.from(this.token0Amount).div(this.token1Amount).mul(100).div(97);
    }
    //(token1Amount/token0Amount)/0.97
    t0InstantPrice() {
        return ethers_1.ethers.BigNumber.from(this.token1Amount).div(this.token0Amount).mul(100).div(97);
    }
}
exports.uniswapV2Like = uniswapV2Like;

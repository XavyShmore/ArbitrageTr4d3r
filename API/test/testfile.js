"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const moralis_1 = require("../moralis");
var run = async () => {
    var block;
    block = await moralis_1.moralisAPI.getBlockData(13890186, "eth");
    console.log(block.transactions.length);
};
run();

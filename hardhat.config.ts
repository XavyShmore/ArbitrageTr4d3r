import "@nomiclabs/hardhat-ethers"
import { runInNewContext } from "vm";

module.exports = {
  solidity:{
    version:"0.7.3",
    settings: {
      optimizer: {
        enabled: true,
        runs: 99999,
      }
    }
  },
  paths:{
    sources:"./Ethereum/sources",
    cache:"./Ethereum/cache",
    artifacts:"./Ethereum",
  },
  networks:{
    hardhat:{
      mining:{
        auto:false,
        interval:500
      }
    }
  }
};

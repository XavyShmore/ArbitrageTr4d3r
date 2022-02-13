import fs from "fs-extra";

var init = fs.readJSONSync(process.cwd()+"/data/script/erc20Addresses.json");

var sec= fs.readJSONSync(process.cwd()+"/data/ERC20.json");

console.log("old:", Object.keys(init.Mainnet).length, "new:", Object.keys(sec["0"]).length);
import fs from "fs-extra";
import { internalDataAPI } from "../../API/APImanager";
import { Chain } from "../../Class/primitives";

var path = `${process.cwd()}/data/script/erc20Addresses.json`
console.log("Path: ",path);

var data:{[net:string]:{[address:string]:any}} = fs.readJSONSync(path)

var addresses: string[] = []

for(var a in data.Mainnet){
    addresses.push(a);
}

internalDataAPI.addToken(addresses,Chain.mainnet);
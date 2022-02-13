import { moralisAPI} from "./moralis";
import { TokenMetaData,Token,Chain,emptyTokenMetaData } from "../Class/primitives";
import fs, { promises } from "fs-extra";

export class ExternalDataAPI {
    static getTokenMetadata (addresses:string[], chain:Chain):Promise<{[name:string]:TokenMetaData}>{
        return  moralisAPI.getTokenInfoByAddress(addresses,chain)
    }
}

type ERC20Data = {
    [chain in Chain]:{[address:string]:TokenMetaData}
}
type dexData = {
    [chain in Chain]:{}
}

export class internalDataAPI {

    static rootDir:string = process.cwd();
    static dataFolderPath = "data";

    static tokenDBPath = `${this.rootDir}/${this.dataFolderPath}/ERC20.json`;
    static dexDBPath = `${this.rootDir}/${this.dataFolderPath}/DEX.json`;

    //private static _tokenDB:ERC20Data
    //private static _dexDB: 


    static async getTokenMetadata(addresses:string[], chain:Chain = Chain.mainnet, update:boolean = false):Promise<{[name:string]:TokenMetaData}>{

        if (update){
            return await ExternalDataAPI.getTokenMetadata(addresses,chain);
        } else{
            console.log(this.dataFolderPath)
            var data:ERC20Data 
            var output:{[name:string]:TokenMetaData} = {}
            try {
                data = await fs.readJson(this.tokenDBPath);

                var chainData = data[chain]

                for (var key in chainData){
                    console.log(key)
                    if (key in addresses){
                        output[key] = chainData[key]
                    }
                }
            }
            catch (err){
                console.error(err);
            }
            finally{
                return output
            }
        }
    }
    static async updateTokenMetadata(chain:Chain=Chain.mainnet, addresses?:string[]):Promise<{[address:string]:TokenMetaData}>{
        
        var chainData:{[addresse:string]:TokenMetaData} = {["asd"]:emptyTokenMetaData("asd")}

        var newTokens:string[] = []

        var data:ERC20Data = {
            1: {}, 
            4: {}, 
            31337: {},
            3: {},
            5: {},
            137: {},
            80001: {}
        }

        try{
            data = await fs.readJSON(this.tokenDBPath)
            chainData = data[chain]
        }catch (err){
            console.error(err);
        }

        if (typeof addresses === 'undefined'){          
            addresses = [];
            addresses = Object.keys(chainData);
        }else{
            for(var a in addresses){
                if (!(addresses[a] in chainData)){
                    chainData[addresses[a]]=emptyTokenMetaData(addresses[a],chain)
                    newTokens.push(addresses[a]);
                }
            }
        }

        var onlineData = await this.getTokenMetadata(addresses,chain, true);

        function replaceIfNotNull(init:any,replacement:any){
            if (replacement == null){
                return init
            }else{
                return replacement
            }
        }
        for (var e in onlineData){

            var od = onlineData[e]
            var cd = chainData[e]

            chainData[e].name = replaceIfNotNull(cd.name,od.name);
            chainData[e].symbol = replaceIfNotNull(cd.symbol,od.symbol);
            chainData[e].decimals = replaceIfNotNull(cd.decimals,od.decimals);
            chainData[e].logo = replaceIfNotNull(cd.logo,od.logo);
            chainData[e].logo_hash = replaceIfNotNull(cd.logo_hash,od.logo_hash);
            chainData[e].thumbnail = replaceIfNotNull(cd.thumbnail,od.thumbnail);
            chainData[e].block_number = replaceIfNotNull(cd.block_number,od.block_number);
            chainData[e].validated = replaceIfNotNull(cd.validated,od.validated);
        }

        for (var a in newTokens){
            if (chainData[newTokens[a]] == emptyTokenMetaData(newTokens[a],chain)){
                delete chainData[newTokens[a]]
            }
        }

        data[chain] = chainData

        try{
            fs.outputJSON(this.tokenDBPath,data);
        }catch (err){
            console.error(err);
        }

        var output:{[address:string]:TokenMetaData} = {}

        for (var a in addresses){
            output[addresses[a]] = chainData[addresses[a]]
        }
        return output;
    }
    static async addToken(adddresses:string[],chain:Chain=Chain.mainnet):Promise<{[address:string]:TokenMetaData}>{
        var newTokens = await this.updateTokenMetadata(chain,adddresses);
        for (var a in adddresses){
            if (!(Object.keys(newTokens).includes(adddresses[a]))){
                console.log(`Token ${adddresses[a]} is not found`)
            }
        }
        return newTokens;
    }
}
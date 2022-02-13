"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.moralisAPI = void 0;
const got_1 = __importDefault(require("got"));
const primitives_1 = require("../Class/primitives");
const callPerMinute = 3000;
const tbc = 1000 / (callPerMinute / 60); //time allowed between moralis call in ms
const options = {
    headers: {
        accept: "application/json",
        "X-API-Key": "YxV8xATHxPzLuXYhgO4ENEbibnWMMsFzoALAfuYmscj8Tpv1U5miokgcklfSRFDQ",
    },
};
var moralisChain;
(function (moralisChain) {
    moralisChain["mainnet"] = "eth";
    moralisChain["rinkeby"] = "rinkeby";
})(moralisChain || (moralisChain = {}));
function chainToMoralisChainString(chain) {
    switch (chain) {
        case primitives_1.Chain.mainnet:
            return moralisChain.mainnet;
        case primitives_1.Chain.rinkeby:
            return moralisChain.rinkeby;
    }
}
class moralisAPI {
    static useAPI() {
        this.used++;
        if (this.used == 1) {
            this.ExecuteApiCall();
        }
    }
    static releaseAPI() {
        this.used--;
    }
    static getTokenInfoByAddress(addresses, chain) {
        return new Promise((finished) => {
            var fullArray = [""];
            var count = 0;
            for (var val of addresses) {
                if (count < 36) {
                    fullArray[fullArray.length - 1] += `&addresses=${val}`;
                }
                else {
                    fullArray.push(`&addresses=${val}`);
                    count = 0;
                }
                count++;
            }
            var promiseArray = [];
            for (var element in fullArray) {
                promiseArray.push(new Promise((resolve, reject) => {
                    var queueElement = {
                        url: `${this.endpoint}/erc20/metadata?chain=${chainToMoralisChainString(chain)}${fullArray[element]}`,
                        resolve: resolve,
                        reject: reject
                    };
                    this.queue.push(queueElement);
                }));
            }
            this.useAPI();
            Promise.allSettled(promiseArray).then((data) => {
                var collectedData = [];
                for (var element in data) {
                    var batch = data[element];
                    if (batch.status == "fulfilled") {
                        collectedData = collectedData.concat(batch.value);
                    }
                }
                var tokenRequestDict = {};
                for (element in collectedData) {
                    var token = {
                        address: collectedData[element].address,
                        chain: chain,
                        contractFctGas: {},
                        name: collectedData[element].name,
                        symbol: collectedData[element].symbol,
                        decimals: collectedData[element].decimals,
                        logo: collectedData[element].logo,
                        logo_hash: collectedData[element].logo_hash,
                        thumbnail: collectedData[element].thumbnail,
                        block_number: collectedData[element].block_number,
                        validated: collectedData[element].validated
                    };
                    tokenRequestDict[token.address] = token;
                }
                this.releaseAPI();
                finished(tokenRequestDict);
            });
        });
    }
    static getBlockData(blockNumber, chain) {
        return new Promise((resolve, reject) => {
            var queueElement = {
                url: `${this.endpoint}/block/${blockNumber.toString()}?chain=${chain}`,
                resolve: (value) => {
                    this.releaseAPI();
                    resolve(value);
                },
                reject: reject
            };
            console.log("URL: " + queueElement.url);
            this.queue.push(queueElement);
            this.useAPI();
        });
    }
    static async ExecuteApiCall() {
        var entry = this.pqueue.shift();
        if (entry) {
            request(entry);
        }
        else {
            entry = this.queue.shift();
            if (entry) {
                request(entry);
            }
        }
        setTimeout(() => {
            if (this.used > 0) {
                this.ExecuteApiCall();
            }
        }, tbc);
        async function request(entry) {
            try {
                var response = await (0, got_1.default)(entry.url, options);
                entry.resolve(JSON.parse(response.body));
            }
            catch (err) {
                console.log("rejected:" + err);
                entry.reject();
            }
        }
    }
}
exports.moralisAPI = moralisAPI;
moralisAPI.used = 0;
moralisAPI.queue = [];
moralisAPI.pqueue = [];
moralisAPI.endpoint = "https://deep-index.moralis.io/api/v2";

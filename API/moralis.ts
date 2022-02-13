import got from "got";
import {Chain, TokenMetaData,emptyTokenMetaData} from "../Class/primitives" ;

const callPerMinute = 3000;
const tbc = 1000 / (callPerMinute / 60); //time allowed between moralis call in ms

const options = {
  headers: {
    accept: "application/json",
    "X-API-Key":
      "YxV8xATHxPzLuXYhgO4ENEbibnWMMsFzoALAfuYmscj8Tpv1U5miokgcklfSRFDQ",
  },
};
type QueueEntry = {
  url: string;
  resolve: (value: any | PromiseLike<any>) => void;
  reject: (reason?: any) => void;
};

enum moralisChain {
  mainnet = "eth",
  rinkeby = "rinkeby",
}

function chainToMoralisChainString (chain:Chain){
  switch (chain){
    case Chain.mainnet:
      return moralisChain.mainnet
    case Chain.rinkeby:
      return moralisChain.rinkeby
  }
}

type moralisTokenMetadata = {
  address: string;
  name: string | null;
  symbol: string|null;
  decimals: string | null;
  logo: string | null;
  logo_hash: string | null;
  thumbnail: string | null;
  block_number: string | null;
  validated: number | null;
};

export type blockMetaData = {
  "timestamp": string,
  "number": string,
  "hash": string,
  "parent_hash": string,
  "nonce": string,
  "sha3_uncles": string,
  "logs_bloom": string,
  "transactions_root": string,
  "state_root": string,
  "receipts_root": string,
  "miner": string,
  "difficulty": string,
  "total_difficulty": string,
  "size": string,
  "extra_data": string,
  "gas_limit": string,
  "gas_used": string,
  "transaction_count": string,
  "transactions":[transactionDetail]
}

export type transactionDetail = {
  "hash": string,
  "nonce": string,
  "transaction_index": string,
  "from_address": string,
  "to_address": string,
  "value": string,
  "gas": string,
  "gas_price": string,
  "input": string,
  "receipt_cumulative_gas_used": string,
  "receipt_gas_used": string,
  "receipt_contract_address": any
  "receipt_root": any
  "receipt_status": string,
  "block_timestamp": string,
  "block_number": string,
  "block_hash": string,
  "logs":any
}

export class moralisAPI {
  private static used: number = 0;
  private static queue: QueueEntry[] = [];
  private static pqueue: QueueEntry[] = [];

  static endpoint: string = "https://deep-index.moralis.io/api/v2";

  private static useAPI(){
    this.used++;
      if (this.used == 1) {
        this.ExecuteApiCall();
      }
  }
  private static releaseAPI(){
    this.used--;
  }

  static getTokenInfoByAddress(addresses: string[],chain: Chain): Promise<{[name:string]:TokenMetaData}> {
    return new Promise<{[name:string]:TokenMetaData}>((finished) => {
      var fullArray: string[] = [""];
      var count = 0;

      for (var val of addresses) {
        if (count < 36) {
          fullArray[fullArray.length - 1] += `&addresses=${val}`;
        } else {
          fullArray.push(`&addresses=${val}`);
          count = 0;
        }
        count++;
      }

      var promiseArray: Promise<moralisTokenMetadata[]>[] = [];

      for (var element in fullArray) {
        promiseArray.push(
          new Promise<moralisTokenMetadata[]>((resolve, reject) => {
            var queueElement: QueueEntry = {
              url: `${this.endpoint}/erc20/metadata?chain=${chainToMoralisChainString(chain)}${fullArray[element]}`,
              resolve: resolve,
              reject: reject
            };
            this.queue.push(queueElement);
          })
        );
      }
      this.useAPI();

      Promise.allSettled(promiseArray).then((data) => {

        var collectedData: moralisTokenMetadata[] = [];
        
        for (var element in data) {
          var batch = data[element];
          if (batch.status == "fulfilled") {
            collectedData = collectedData.concat(batch.value);
          }
        }
        var tokenRequestDict:{[name:string]:TokenMetaData} = {}
        for (element in collectedData) {

            var token:TokenMetaData = {
              address:collectedData[element].address,
              chain:chain,

              contractFctGas: {},

              name:collectedData[element].name,
              symbol:collectedData[element].symbol,
              decimals:collectedData[element].decimals,
              logo:collectedData[element].logo,
              logo_hash:collectedData[element].logo_hash,
              thumbnail:collectedData[element].thumbnail,
              block_number:collectedData[element].block_number,
              validated:collectedData[element].validated
            }

            tokenRequestDict[token.address] = token;
        }
        this.releaseAPI();
        finished(tokenRequestDict);
      });
    });
  }
  static getBlockData(blockNumber:number,chain:Chain){
    return new Promise<blockMetaData>((resolve,reject)=>{
      var queueElement: QueueEntry = {
        url: `${this.endpoint}/block/${blockNumber.toString()}?chain=${chain}`,
        resolve: (value) => {
          this.releaseAPI();
          resolve(value)},
        reject: reject
      };
      console.log("URL: "+ queueElement.url)
      this.queue.push(queueElement);
      this.useAPI();
    })
  }

  static async ExecuteApiCall() {
    var entry = this.pqueue.shift();
    if (entry) {
      request(entry);
    } else {
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
    async function request(entry: QueueEntry) {
      try {
        var response = await got(entry.url, options);
        entry.resolve(JSON.parse(response.body));
      } catch (err) {
        console.log("rejected:" + err);
        entry.reject();
      }
    }
  }
}
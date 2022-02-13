import { moralisAPI,blockMetaData} from "../moralis";
import { Chain } from "../../Class/primitives";

var run = async () => {
    var block:blockMetaData;
    block = await moralisAPI.getBlockData(13890186,"eth")
    console.log(block.transactions.length)
}

run();
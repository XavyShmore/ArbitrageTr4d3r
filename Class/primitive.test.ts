import { expect } from "chai";
import testWallet from "../Wallet/testOnlyWallet";
import { Chain, ChainClass } from "./primitives";

describe("primitive",()=>{
    describe("ChainClass",()=>{

        let testNetworkAddress = "http://127.0.0.1:8545/";

        function tests (cc:ChainClass){
            expect(cc.provider).is.ok;
            expect(cc.signer).is.ok;
            expect(cc.signer.provider).not.be.null;
            expect(cc.chain).is.ok;
            expect(cc.providerAddress).is.ok;
        }

        it("works with set wallet",()=>{
            let cc = new ChainClass(testNetworkAddress,Chain.hardhat,testWallet);
            tests(cc);
        });
        it("works without set wallet",()=>{
            let cc = new ChainClass(testNetworkAddress,Chain.hardhat);
            tests(cc);
        });
    });
});
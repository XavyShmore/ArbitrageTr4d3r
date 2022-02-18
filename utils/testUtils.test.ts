import { expect } from "chai";
import { ethers } from "ethers";
import testUtils from "./testUtils";



describe("testUtils",()=>{
    describe("Accounts", ()=>{
        it("generate",async()=>{
            let signers = await testUtils.accounts.generate();
            expect(signers.length).to.equal(20);
            signers.forEach((signer)=>{
                expect(signer.provider,"Provider not set").ok;
            });
        });
    });
    describe("UniswapV2Like", function () {
        this.timeout(30000);
        it("setUp",async()=>{
            let response = await testUtils.uniswapV2Like.setUp();
            expect(response.factory.functions,"factory isn't deployed properly").ok;
            expect(response.router.functions, "router isn't deployed properly").ok;
        });
        it("generatePairs",async()=>{
            let response = await testUtils.uniswapV2Like.generatePairs(5);
            expect(response.length == 5,"Something does'nt work").ok;
        });
    });
    describe("Erc20",function(){
        this.timeout(10000);
        it("generateTestToken",async()=>{

            let numtoken =3;
            let initialMint = 20000;
            let decimal = 16;

            let tokens = await testUtils.erc20.generateTestToken(numtoken,initialMint,decimal);
            expect(tokens.length,`Incorrect number of token produced. Should be: ${numtoken}`).to.equal(numtoken);
            expect(tokens[numtoken-1].functions,"At least one token is not deployed properly").ok;

            /* To work on
            expect((await tokens[numtoken-1].balanceOf(await tokens[numtoken-1].signer.getAddress())).eq(initialMint),"Initial balance is not properly setup").equal(true);
            expect((await tokens[numtoken-1].decimals()).eq(decimal),"decimals not properly setup").equal(true);
            */
        });
    });
});
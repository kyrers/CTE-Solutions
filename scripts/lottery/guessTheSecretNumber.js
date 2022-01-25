const { ethers } = require("hardhat");

async function main() {
    //The contract abi
    const abi = [
        {"constant":false,"inputs":[{"name":"n","type":"uint8"}],"name":"guess","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},
        {"constant":true,"inputs":[],"name":"isComplete","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},
        {"inputs":[],"payable":true,"stateMutability":"payable","type":"constructor"}
    ];
    
    //The contract address - Just copy it from the CTE challenge page
    const contractAddress = "0xe00f253fA2f3F2370b74020F99C491170925beA8";
    
    /* 
    * To solve the challenge, you neeed to use your ropsten account, as CTE is expecting that account address.
    * To that effect, you need to export your private key from metamask and place it in the hardhat.config.js - the template is already there.
    * Then, we can get your wallet as the signer. The console.log should print your ropsten account address.
    */
    const [signer] = await ethers.getSigners();
    console.log("SIGNER: ", signer.address)

    //Get the contract and connect using your account
    var cteContract = new ethers.Contract(contractAddress, abi, signer);

    /*
    * Find the number that matches the challenge hash.
    * The function parameter is an uint8, which greatly limits our search since we know the number is less than 2⁸ == 256.
    * So, we just run a loop, hash the current value and then check if the hash matches.
    */
    let solution = 0;
    for(let i = 0; i < 2 ** 8; i++) {
        let hash = ethers.utils.keccak256(i);
        if(hash === "0xdb81b4d58595fbbbb592d3661a34cdca14d7ab379441400cbfa1b78bc447c365") {
            solution = i;
            break;
        }
    }
    console.log(solution);

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


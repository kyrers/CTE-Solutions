const { ethers } = require("hardhat");

async function main() {
    //The contract abi
    const abi = [
        {"constant": true, "inputs": [], "name": "isComplete", "outputs": [{"name": "", "type": "bool"}], "payable": false, "stateMutability": "view", "type": "function"},
        {"constant": false, "inputs": [{ "name": "publicKey", "type": "bytes"}], "name": "authenticate", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function"}
    ];

    //The contract address - Just copy it from the CTE challenge page
    const contractAddress = "0xAaDBC3e5C4978aaF78A2C73EA2f4A18E02Ef748b";

    //Get your account
    const [signer] = await ethers.getSigners();
    console.log("SIGNER: ", signer.address)

    //Get the contract and connect using your account
    var cteContract = new ethers.Contract(contractAddress, abi, signer);

    //The challenge contract owner address
    const challengeOwnerAddress = "0x92b28647ae1f3264661f72fb2eb9625a89d88a31";

    //We could just check Etherscan to see if this address has any outgoing transactions, but let's do this just as practice
    let addressTxs = await ethers.provider.getTransactionCount(challengeOwnerAddress);
    console.log("ADDRESS OUTGOING TX COUNT: ", addressTxs);
    console.log("---------------------------");

    //Get the outgoing transaction hash. We'll need Etherscan help here :(
    let addressOutgoinTxHash = "0xabc467bedd1d17462fcc7942d0af7874d6f8bdefee2b299c9168a216d3ff0edb";
    let outgoingTx = await ethers.provider.getTransaction(addressOutgoinTxHash);
    console.log("THE OUTGOING TX: ", outgoingTx);
    console.log("---------------------------");

    //We can now reconstruct the transaction
    let txData = {
        gasPrice: outgoingTx.gasPrice,
        gasLimit: outgoingTx.gasLimit,
        value: outgoingTx.value,
        nonce: outgoingTx.nonce,
        data: outgoingTx.data,
        to: outgoingTx.to,
        chainId: outgoingTx.chainId
    };

    //We also know the signature values
    let signature = {r: outgoingTx.r, s: outgoingTx.s, v: outgoingTx.v};

    //Let's serialize the transaction
    let serializedTx = ethers.utils.serializeTransaction(txData);
    console.log("SERIALIZED TRANSACTION: ", serializedTx);
    console.log("---------------------------");

    //Get the serialized transaction hash
    let serializedTransactionHash = ethers.utils.keccak256(serializedTx);
    console.log("SERIALIZED TRANSACTION HASH: ", serializedTransactionHash);
    console.log("---------------------------");

    /*
    * And now, let's recover the public key. We have to remove the prefix, which in this case will be 0x04 as both x and y points of the elyptic curve follow.
    * We need to add the 0x again
    */
    let publicKey = `0x${ethers.utils.recoverPublicKey(serializedTransactionHash, signature).substring(4)}`;
    console.log("PUBLIC KEY: ", publicKey);
    console.log("---------------------------");

    //Now, we just have to authenticate ourselves
    let authenticateTx = await cteContract.authenticate(publicKey.toString("hex"));
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
const { ethers } = require("hardhat");
const BN = require('bn.js');
const { Wallet } = require("ethers");
const EC = require('elliptic').ec;

async function main() {
    //The contract abi
    const abi = [
      {"constant": false, "inputs": [], "name": "authenticate", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function"},
      {"constant": true, "inputs": [], "name": "isComplete", "outputs": [{"name": "", "type": "bool" }], "payable": false, "stateMutability": "view", "type": "function"}
    ];

    //The contract address - Just copy it from the CTE challenge page
    const contractAddress = "0x37DbfcFF0979873A12cd8Ad2f00c91807157fF51";

    //The account to hack
    const ACCOUNT_TO_HACK = "0x6B477781b0e68031109f21887e6B5afEAaEB002b";

    //Get both exploit transactions
    let firstExploitTxHash = "0x061bf0b4b5fdb64ac475795e9bc5a3978f985919ce6747ce2cfbbcaccaf51009";
    let firstExploitTx = await ethers.provider.getTransaction(firstExploitTxHash);
    console.log("THE FIRST EXPLOIT TX: ", firstExploitTx);
    console.log("---------------------------");

    let secondExploitTxHash = "0xd79fc80e7b787802602f3317b7fe67765c14a7d40c3e0dcb266e63657f881396";
    let secondExploitTx = await ethers.provider.getTransaction(secondExploitTxHash);
    console.log("THE SECOND EXPLOIT TX: ", secondExploitTx);
    console.log("---------------------------");

    //Store the equal r value, and the s values
    const r = firstExploitTx.r;
    const s1 = firstExploitTx.s;
    const s2 = secondExploitTx.s;

    /*
    * These transactions have the same r value for the signature, which means that the same nonce (v) was used. This is our exploit vector.
    * Through some math beyond this scope, it is possible to discover ECDSA private keys when the same nonce is reused. Here we will just do it.
    * Suffice to say that ECDSA signature s is computed using s = k^-1 (z + r * privateKey) mod p, where k is our nonce (v), z is the message hash, 
    * r is the r value we have determined and p is a constant.
    */ 
    let firstTxData = {
        gasPrice: firstExploitTx.gasPrice,
        gasLimit: firstExploitTx.gasLimit,
        value: firstExploitTx.value,
        nonce: firstExploitTx.nonce,
        data: firstExploitTx.data,
        to: firstExploitTx.to,
        chainId: firstExploitTx.chainId
    };

    let secondTxData = {
        gasPrice: secondExploitTx.gasPrice,
        gasLimit: secondExploitTx.gasLimit,
        value: secondExploitTx.value,
        nonce: secondExploitTx.nonce,
        data: secondExploitTx.data,
        to: secondExploitTx.to,
        chainId: secondExploitTx.chainId
    };

    //Let's serialize both transactions and get their msg hash
    let firstTxSerialized = ethers.utils.serializeTransaction(firstTxData);
    let z1 = ethers.utils.keccak256(firstTxSerialized);
    let secondTxSerialized = ethers.utils.serializeTransaction(secondTxData);
    let z2 = ethers.utils.keccak256(secondTxSerialized);

    console.log("r: ", r.toString("hex"));
    console.log("s1: ", s1.toString("hex"));
    console.log("s2: ", s2.toString("hex"));
    console.log("z1: ", z1.toString("hex"));
    console.log("z2: ", z2.toString("hex"));
    console.log("---------------------------");

    //Now we find out the private key
    //recoverPrivateKey is based on: https://github.com/tomazy/capturetheether/blob/master/src/challenges/account-takover.js with small modifications
    var results = recoverPrivateKey(r, s1, s2, z1, z2);
    
    //Determine the correct private key
    var wallet;
    results.some(pk => {
        wallet = new Wallet(pk.toString("hex"), ethers.getDefaultProvider("ropsten"));
        
        if (wallet.address === ACCOUNT_TO_HACK) {
          privateKey = pk.toString("hex");
          console.log("PRIVATE KEY FOUND: ", pk.toString("hex"));
          console.log("---------------------------");
          return true;
        }
    });

    //Get the contract and connect using the account you hacked
    var cteContract = new ethers.Contract(contractAddress, abi, wallet);
    cteContract.connect(wallet);

    //And now the only thing left is for us to authenticate ourselves
    var authenticateTx = await cteContract.authenticate();
    var authenticateTxReceipt = await authenticateTx.wait();
    console.log("WE'VE AUTHENTICATED OURSELVES: ", authenticateTxReceipt);
}

/**
 * Returns possible private key candidates. Only one of them will match the address.
 * @param r
 * @param s1
 * @param s2
 * @param z1
 * @param z2
 * @returns {BN[]}
 */
 function recoverPrivateKey(rHex, s1Hex, s2Hex, z1Hex, z2Hex) {
    const r = new BN(rHex.replace("0x", ""), "hex");
    const s1 = new BN(s1Hex.replace("0x", ""), "hex");
    const s2 = new BN(s2Hex.replace("0x", ""), "hex");
    const z1 = new BN(z1Hex.replace("0x", ""), "hex");
    const z2 = new BN(z2Hex.replace("0x", ""), "hex");

    const ec = new EC('secp256k1')
    /*
           z1 - z2
      k = ---------
           s1 - s2
     */
    const kCandidates = [
      z1.sub(z2).umod(ec.n).mul(s1.sub(s2).invm(ec.n)).umod(ec.n),
      z1.sub(z2).umod(ec.n).mul(s1.neg().add(s2).invm(ec.n)).umod(ec.n),
      z1.sub(z2).umod(ec.n).mul(s1.add(s2).invm(ec.n)).umod(ec.n),
      z1.sub(z2).umod(ec.n).mul(s1.neg().sub(s2).invm(ec.n)).umod(ec.n),
    ]
    .filter(k => r.eq(ec.curve.g.mul(k).x))

    /*
          sk - z
    dA = -----------
             r
    */
    const results = kCandidates
      .map(k => s1.mul(k).sub(z1).umod(ec.n).mul(r.invm(ec.n)).umod(ec.n));

    return results
  }

main()
.then(() => process.exit(0))
.catch((error) => {
    console.log(error);
    process.exit(1);
});
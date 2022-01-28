const { ethers } = require("hardhat");

async function main() {
    const [signer] = await ethers.getSigners();
    console.log("SIGNER: ", signer.address)

    //Deploy the solver contract using your account
    console.log("Deploying contract with the account:", signer.address);
    const SolverContractFactory = await ethers.getContractFactory("GuessTheNewNumberSolver");
    const SolverContract = await SolverContractFactory.deploy();
    console.log("Solver Contract address:", SolverContract.address);

    //The contract address - Just copy it from the CTE challenge page
    const challengeAddress = ethers.utils.getAddress("0xB413D13aeeB0197BD76daE6EBe1B42DDc97Adf39");

    //Send the transaction
    let tx = await SolverContract.guess(challengeAddress, {value: ethers.utils.parseEther("1")});
    console.log("TX: ", tx);

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
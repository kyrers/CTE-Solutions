require("@nomiclabs/hardhat-waffle");

//Template for ropsten deployment

const ACCOUNT_PK = "d956dcf4df4f4922a02e35e65db30ec90b0c0adbadbcd0c1c288030fff5f20a0";

module.exports = {
  solidity: "0.8.7",
  networks: {
    ropsten: {
      url: "https://ropsten.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
      accounts: [`${ACCOUNT_PK}`]
    }
  }
};

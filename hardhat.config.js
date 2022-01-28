require("@nomiclabs/hardhat-waffle");

//Template for ropsten deployment

const ACCOUNT_PK = "YOUR_ROPSTEN_ACCOUNT_PK";

module.exports = {
  solidity: "0.8.11",
  networks: {
    ropsten: {
      url: "ROPSTEN_RPC",
      accounts: [`${ACCOUNT_PK}`],
      gas: 2100000,
      gasPrice: 8000000000
    }
  }
};

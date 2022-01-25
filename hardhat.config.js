require("@nomiclabs/hardhat-waffle");

//Template for ropsten deployment

const ACCOUNT_PK = "YOUR_ROPSTEN_ACCOUNT_PK";

module.exports = {
  solidity: "0.8.7",
  networks: {
    ropsten: {
      url: "ROPSTEN RPC",
      accounts: [`${ACCOUNT_PK}`]
    }
  }
};

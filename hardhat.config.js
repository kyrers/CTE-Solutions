require("@nomiclabs/hardhat-waffle");

//Template for ropsten deployment

const ACCOUNT_PK = "YOUR ROPSTEN ACCOUNT PK";

module.exports = {
  solidity: "0.8.7",
  networks: {
    ropsten: {
      url: "ROPSTEN RPC",
      accounts: [`${ACCOUNT_PK}`]
    }
  }
};

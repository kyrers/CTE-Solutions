require("@nomiclabs/hardhat-waffle");

//Template for ropsten deployment
const ACCOUNT_PK = "YOUR_ROPSTEN_ACCOUNT_PK";
const SECOND_ACCOUNT_PK = "ANOTHER_ROPSTEN_ACCOUNT_PK";

module.exports = {
  solidity: { 
    compilers: [{version: "0.8.11"}, {version: "0.8.12"}]
  },
  networks: {
    ropsten: {
      url: "ROPSTEN_RPC",
      accounts: [`${ACCOUNT_PK}`, `${SECOND_ACCOUNT_PK}`],
      gas: 2100000,
      gasPrice: 8000000000
    }
  }
};

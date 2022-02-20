// SPDX-License-Identifier: MIT

pragma solidity ^0.8.12;

interface IChallenge {
    function authenticate() external;
}

/// @title The challenge helper
/// @author kyrers
/// @notice This contract will authenticate us and solve the challenge
contract FuzzyIdentityHelper {
    
    ///@notice This will call the authenticate function in our challenge address
    function authenticate() external {
        IChallenge(0xCHALLENGEADDRESS).authenticate();
    }

    /// @notice The challenge contract calls the name function of the msg.sender and checks that the name is bytes32("smarx").
    function name() external pure returns (bytes32) {
        return bytes32("smarx");
    }
}
// SPDX-License-Identifier: MIT

pragma solidity ^0.8.12;

/// @title The challenge helper
/// @author kyrers
/// @notice This will fund the contract with some wei after it is destructed
contract FiftyYearsHelper {
    /// @notice Contract constructor. Needs to receive the appropriate amount of wei
    constructor() payable {
        require(msg.value == 2 wei);
    }

    /// @notice Destroy the contract and send its balance to the CTE challenge contract
    function kill() public {
        selfdestruct(payable(address(0x91Efe024ad7476A147328201Ff9aD093ca495819)));
    }
}
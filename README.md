# CTE-Solutions
This repo contains solutions for the Capture The Ether challenges. There are plenty of solutions around the web, however the goal of this repo is to solve the challenges locally, i.e avoid Etherscan when possible and just write your code locally.

The `hardhat.config.js` file has a template for ropsten network interaction.

[Warmup challenges;](#warmup)

[Lottery challenges;](#lottery)

[Math challenges;](#math)

[Account challenges;](#accounts)

## WARMUP

### Call Me/Set Nickname
Call Me and Set Nickname are very similar, so there is only code for the more complex one - Set Nickname. 
In the code, you will find the script `setNickname.js`. The code has comments explaining what each line does. Still, here is what we need to do:
1. Get the contract abi and address;
2. Get the private key of the ropsten account you are using to interact with Capture The Ether. Otherwise, you can't pass the challenge as CTE doesn't know who you are;
3. Get the contract and connect with it using your account;
4. Call the `setNickname` function sending the nickname you want as a parameter; For the Call Me challenge, it's even easier, as the function requires no parameters.

So, to solve this challenge just add the required information to the code and run `npx hardhat run scripts/warmup/setNickname.js --network ropsten`.

## LOTTERY

### Guess the Number
This is very similar to the warmup challenges.
In the code, you will find the script `guessTheNumber.js`. The code has comments explaining what each line does. Still, here is what we need to do:
1. Looking at the constructor you will notice that you need to have 1 Ropsten ETH in your account before pressing the Begin Challenge button, otherwise the transaction will fail;
2. After deploying the contract we can now solve the challenge locally. Again, we need to get the contract abi and address. Then, we need to connect to it using your account.
3. As you must have already noticed, the answer is in the code. The number is 42. However, look at the `guess()` function. Where have you seen that `require()` statement before? Exactly, you need to send 1 ETH to the function in order to solve it.

So, to solve this challenge just add the required information to the code and run `npx hardhat run scripts/lottery/guessTheNumber.js --network ropsten`.

### Guess the Secret Number
This is almost equal to the previous challenge.
In the code, you will find the script `guessTheSecretNumber.js`. The code has comments explaining what each line does. Still, here is what we need to do:
1. Do step 1 and 2 from the previous challenge;
2. This time we only have the hash of the number we need to send to the `guess()` function. We need to figure out the number by running a loop, hashing the current loop counter value and then check if the hash matches. You probably saw that the `guess()` function takes an `uint8` as a parameter. This tells us that the number is less than 256, because the `uint8` max value is `2⁸-1 = 255`;
3. When we have the correct number, we just need to call the `guess()` function and send 1 ETH to it again.

So, to solve this challenge just add the required information to the code and run `npx hardhat run scripts/lottery/guessTheSecretNumber.js --network ropsten`.

### Guess the Random Number
This challenge requires a bit more work. There are at least three ways to solve this:
1. Check the Etherscan contract creation transaction, look for state changes. You will find the solution there. This is not the goal of this solution;
2. Get the value in position 0 of the contract storage;
3. Compute the solution using the same formula that the challenge uses.

These last two option allow us to interact with the contract. Option 2 is the easiest, but both can be found in the `guessTheRandomNumber.js` script.
As always, the code has comments explaining what each line does. Still, here is what's needed for each solution:
1. Do step 1 and 2 from the previous challenge;

**Solution 2:**

2. Get the value from position 0 of the contract storage and convert it to uint8;
3. When we have the correct number, we just need to call the `guess()` function and send 1 ETH to it again.

**Solution 3:**

2. We need the hash of the contract creation transaction, which we can get from Etherscan.
3. Get the contract creation transaction itself using the hash;
4. Get the block in which the transaction was included;
5. Get the block parent hash and block timestamp. If you look at the code, you'll notice that `block.blockhash(block.number - 1)` - that's why we get the parent hash of the block the transaction was included in;
6. Compute the hash using the above values;
7. Get the last byte of the hash, because the solution is an `uint8`, and convert it to number.
8. When we have the correct number, we just need to call the `guess()` function and send 1 ETH to it again.

So, to solve this challenge just add the required information to the code and run `npx hardhat run scripts/lottery/guessTheRandomNumber.js --network ropsten`.

### Guess the New Number
This challenge gets a little bit trickier because the answer is calculated when we call the guess function.
One approach to solve this challenge is to create a contract that computes the answer and call the challenge `guess()` function in the same block. This way, our answer is always correct. You will find the contract in `contracts/GuessTheNewNumberSolver.sol`.
Once again, the code is commented and explained. Still, here are the steps needed:
1. Look at the contract and understand what it is doing. The contract has comments explaining everything.
2. We need to deploy the contract. User your account so you can get your ETH back later, after solving the challenge;
3. Call the `guess()` function of the contract you just deployed. As a parameter, we need to send it the challenge address;
4. Call the withdraw function to get your ETH back;

So, to solve this challange first run `npx hardhat compile` to compile the contract. Then, add the required information to the code and run
`npx hardhat run scripts/lottery/deployGuessTheNewNumberSolver.js --network ropsten`.

### Predict the Future
This challenge gets even trickier, because you have to lock in your guess before an answer is calculated.
Luckily for us, we know the answer is between 0 and 9, because we `mod` the calculated `uint8` by 10.
However, knowing this isn't enough. The key to solving this challenge is settling in the correct block.
So, one approach to solve this challenge is to create a contract that locks a guess between 0 and 9. Then, we repeatedly call the `predict()` function of our contract until it determines that settling on the current block will produce the result that matches our locked guess. 
You will find the contract in `contracts/PredictTheFutureSolver.sol`.
Once again, the code is commented and explained. Still, here are the steps needed:
1. Look at the contract and understand what it is doing. The contract has comments explaining everything.
2. We need to deploy the contract. User your account so you can get your ETH back later, after solving the challenge;
3. Call the `lockGuess()` function of the contract you just deployed. As a parameter, we need to send it the our guess;
4. Call the predict function until it determines that settling will produce the result we guessed;
5. Call the withdraw function to get your ETH back;

So, to solve this challange first run `npx hardhat compile` to compile the contract. Then, add the required information to the code and run
`npx hardhat run scripts/lottery/deployPredictTheFutureSolver.js --network ropsten`.

### Predict the Future Block Hash
At first, this challenge may seem like a more complicated version of the previous one. However, it is not.
Looking at the contract, you'll see that the solution is determined by calculating the blockhash of the block you locked your guess in + 1. 
It may seem that this will require a tremendous amount of luck to guess correctly. However, what you should do first is to go to the solidity documentation and
read about the blockhash function. Do it. 
You'll hopefully see that it returns the hash of the last 256 blocks. For earlier blocks it will return 0 - this is how we solve the challenge!
We simply lock our guess that the hash will be 0, then we get the block number our transaction was included in, wait 257 blocks and settle. It will return 0 and we will solve the challenge.
Once again, the code is commented and explained. Still, here are the steps needed:
1. Get the contract abi and address;
2. Get the private key of the ropsten account you are using to interact with Capture The Ether. Otherwise, you can't pass the challenge as CTE doesn't know who you are;
3. Get the contract and connect with it using your account;
4. Lock your guess. Remember, guess 0.
5. Wait 257 blocks. This will take some time. Go rest a little bit :)
6. Settle and get your ETH back;

So, to solve this challange add the required information to the code and run `npx hardhat run scripts/lottery/predictTheFutureBlockHash.js --network ropsten`.

## MATH

### Token Sale
Looking at the contract, it may seem like everything is correct. 
However, if you look closely, you'll see that this contract does not implement SafeMath. Remember, SafeMath is implemented on the language level since solidity version 0.8. This challenge uses an older version, so there's the possibility of overflows. This is how we game the contract.
If you look at the buy function, `require(msg.value == numTokens * PRICE_PER_TOKEN)` has the potential to overflow. Overflowing here would allow us to get a gigantic amount of tokens for a low price. We then sell 1 token for 1 ether, making a profit on the way and leaving the contract with a balance < 1, which is the required condition for us to solve the challenge.
Once again, the code is commented and explained. Still, here are the steps needed:
1. Get the contract abi and address;
2. Get the private key of the ropsten account you are using to interact with Capture The Ether. Otherwise, you can't pass the challenge as CTE doesn't know who you are;
3. Get the contract and connect with it using your account;
4. Determine the amount of tokens to send to cause an overflow;
5. Determine the amount of ether to send;
6. Buy our tokens and wait for them to arrive;
7. Sell 1 token;
8. Profit;

To keep this description short, steps 4 and 5 are detailed in the `tokenSale.js` script. Take a look.
So, to solve this challange add the required information to the code and run `npx hardhat run scripts/math/tokenSale.js --network ropsten`.

### Token Whale
Looking at this contract, you'll hopefully notice that, once again, it is subject to over and underflows.
However, this is part of the solution. Not all of it.
If you look at the `_transfer` function, it spends `msg.sender` tokens instead of tokes from the `from` address passed to the `transferFrom` function.
This means that, if we succesfully call `transferFrom` from an account with 0 tokens, `balanceOf[msg.sender] -= value` will underflow, causing said account to receive a gigantic amount of tokens - 2**256 - 1 to be exact.
After that, all we need is to send 1000000 tokens from the helper account to our account, and we'll have successfully solved the challenge.
You may be thinking "Why do I need a second account? Couldn't I do this just using my account?". You couldn't. You'd never pass this check `require(balanceOf[from] >= value)`, as you'd need value to be 1001 to cause and underflow.
Once again, the code is commented and explained. Still, here are the steps needed:
1. Get the contract abi and address;
2. Get the private key of the ropsten account you are using to interact with Capture The Ether. Otherwise, you can't pass the challenge as CTE doesn't know who you are;
3. Get a second ropsten account;
4. Approve the second account to spend funds from your account. Sign this transaction using your main account;
5. Transfer 1 token from your main account, to that same account. Sign this transaction using the second account. This will cause the underflow and give the second account an enormous amount of tokens;
6. Send the required 1000000 tokens from the second account back to your main account. Sign this transaction using the second account.
7. Wait for them to arrive, and you'll have solved the challenge.

So, to solve this challange add the required information to the code and run `npx hardhat run scripts/math/tokenWhale.js --network ropsten`.

### Retirement fund
Looking at this contract, you'll hopefully notice that, once again, it is subject to over and underflows.
However, this is part of the solution. Not all of it.
If you look at the contract, you'll see that `withdraw` checks that `msg.sender == owner`, since the `owner` is the CTE factory, this function is of no use to us. Meaning, that our solution can only make use of the `collectPenalty` function.
As we've established, the contract is subject to over and underflows, meaning that `uint256 withdrawn = startBalance - address(this).balance;` can be underflowed, allowing us to drain all the ETH the contract has.
To achieve this, `address(this).balance` has to be > 1, which in turn means that we'll have to find away to add some ether to the contract.
The contract has no payable functions, so how can we send ether to the contract? If you look through the Ethereum documentation, you'll hopefully realize that the easiest way to do this is to self destruct another contract that as some ether in it, and send that contract ETH to the CTE challenge contract.
Once again, the code is commented and explained. Still, here are the steps needed:
1. Get the contract abi and address;
2. Get the private key of the ropsten account you are using to interact with Capture The Ether. Otherwise, you can't pass the challenge as CTE doesn't know who you are;
3. Get the contract and connect with it using your account;
4. Deploy our helper contract. Send 1 eth as the msg.value. Don't forget to add the challenge address to the contract kill function;
5. Destroy our helper contract;
6. Call the challenge contract `collectPenalty` function;
7. Wait for challenge contract to be drained and you'll have solved the challenge.

So, to solve this challange add the required information to the code and run `npx hardhat run scripts/math/deployRetirementFundHelper.js --network ropsten`.

### Mapping
To solve this challenge, we need to somehow set `isComplete` to true, or 1.
First, you should read the Ethereum docs to understand how contract storage works. You'll hopefully reach the conclusion that `isComplete` is at `slot 0`. Then, `slot 1` has the `map[]` length. From the documentation, we can also gather that: `keccak256(1)` has the `map[0]` value, `keccak256(1) + 1` has the `map[1]` value and so forth. This is because the contract array is a dynamic size array, so the EVM reserves one slot to store the array length.
From this, we can expect that if we set the map length to 2**256 - 1, the slot that contains the `isComplete` value will be occupied by the array, allowing us to modify it, if we know the corresponding storage address. Since we know that `map[0]` is at `keccak256(1)`, we also know that `map[isComplete] = 2**256 - keccack256(1)`.
Once again, the code is commented and explained. Still, here are the steps needed:
1. Get the contract abi and address;
2. Get the private key of the ropsten account you are using to interact with Capture The Ether. Otherwise, you can't pass the challenge as CTE doesn't know who you are;
3. Get the contract and connect with it using your account;
4. Expand the array bounds to occupy the `isComplete` slot;
5. Determine the storage address of the `isComplete` value;
6. Change it to 1 (true);

So, to solve this challange add the required information to the code and run `npx hardhat run scripts/math/mapping.js --network ropsten`.

### Donation
Looking at the contract, you'll hopefully notice two things almost immediately: the `donate` function calculates `scale` wrong, as it results in `10**36` since `1 ether == 10**18` already, and that we'll need to somehow call `withdraw` to drain the contract.
Taking a deeper look, the `withdraw` function requires us to be the contract `owner`, so we know what our goal is: become the contract owner.
If you read the storage layout docs in the previous challenge you'll remember that struct and array data use their own slots. Since the contract struct is only initialized when the `donate` function is called, we can assume that slot 0 has the `Donation[]` size and that slot 1 has the `owner` address. So, we must write to slot 1 of the contract storage, but how?
This is where the `donate` function is wrong again. It declares `Donation donation` without using either the `memory` or `storage` keywords, which means that this is just an uninitialized pointer to the contract storage. Since the struct has to `uint256` values, `etherAmount` will write to slot 1, where the `owner` address is stored!
All we need to do is determine the `uint256` value of our address and send that as the `etherAmount`, with the needed `msg.value` to pass the `require` check.
Once again, the code is commented and explained. Still, here are the steps needed:
1. Get the contract abi and address;
2. Get the private key of the ropsten account you are using to interact with Capture The Ether. Otherwise, you can't pass the challenge as CTE doesn't know who you are;
3. Get the contract and connect with it using your account;
4. Determine the `uint256` value of our address;
5. Calculate the needed `msg.value`;
6. Make the donation;
7. Withdraw the eth;

So, to solve this challange add the required information to the code and run `npx hardhat run scripts/math/donation.js --network ropsten`.

### Fifty Years
This is the challenge that awards most points for a reason. It requires an orderly combination of transactions, with the intent to exploit the contract using the techniques we've used in the previous challenges.

First, let's try to determine our goal. Looking at the `withdraw` function, particularly the second `require` check, we can see that we need to send an `index` for a contribution that has an `unlockTimestamp` in the past and corresponds to the last contribution made, so we drain all the contributions. This is our goal. Now, how do we do this?

It should be clear that the `upsert` function is key. If we look through its code, we can identify two potential issues: `require(timestamp >= queue[queue.length - 1].unlockTimestamp + 1 days)` is subject to overflows, and the `else` statement relies on a previous declaration of `contribution`, which makes it an uninitialized storage pointer, which allows us to access storage slots 0 (`queue.length`) and 1 (`head`) (remember this from the previous challenge?).
Knowing this, we can determine two steps needed: 
 - Call `upsert` once with a new contribution designed to prepare an overflow of the `timestamp` when we make the second contribution, allowing the second contribution to have `timestamp = 0`. Since the `contribution.unlockTimestamp = timestamp` writes to the `head` storage slot, after this first contribution `head` will have a gigantic value.
 - Make another `upsert` call that resets `head` to 0, while also having an `unlockTimestamp == 0`, which will work, because we've prepared the overflow in the first `upsert` call. 

This will total, 3 contributions (adding to the one that is made when we begin the challenge on CTE). 
There are three things we need to pay attention while executing the two contributions:
- Time units are parsed to seconds, so we need to prepare the overflow taking that into account;
- Ether units are handled in wei, so if we send ETH to the contract the actual `queue.length` will be `x ETH * 10**18`. So we need to send wei, not ether as the `msg.value`;
- `queue.push` increments the `queue.length` before actually inserting the contribution. We've determined that the `queue.length` will be manipulated by the line `contribution.amount = msg.value`. This means that if we want to keep an accurate `queue.length` value, we need to be wary of the `msg.value` we send with each `upsert` call. We know that before our first `upsert` call the `queue.length` is 1, because one contribution was made when we begun the challenge. However, we need to send 1 wei in the first contribution because, even though the line `contribution.amount = msg.value` will mantain the `queue.length` at 1 (when it's actually 2, since this is the second contribution made), the line `queue.push(contribution)` will increment it by 1, which will give us the correct `queue.length` of 2. We follow the same logic for the second `upsert` call and send 2 wei, since 2 + 1 = 3, which by then will be the correct `queue.length`.

At first glance, we may assume that, after these steps, calling `withdraw(2)` would drain the contract. However, this transaction would fail. 
Since `queue.push` increments the `queue.length` before actually pushing the contribution, `contribution.amount = msg.value` will be incremented too. Visualize it this way:
    
    - Contribution 0 (made by CTE): contribution.amount == msg.value == 1 ETH;
    - Contribution 1 (us): contribution.amount == msg.value == 1 wei + `queue.push` == 2 wei;
    - Contribution 2 (us): contribution.amount == msg.value == 2 wei + `queue.push` == 3 wei;
    - Contract total == 1.00...03 ETH, Contributions total == 1.00...05 ETH.

Hence, the transaction will fail until we add 2 wei to the contract, because we're trying to withdraw more ETH than the contract has. This can be done by taking a page out of the RetirementFund challenge. Just create a contract that receives 2 wei on deploy, and then self destruct said contract, sending the 2 wei to our challenge contract.
After that, call `withdraw(2)` and we win!

Once again, the code is commented and explained. Still, here are the steps needed:
1. Get the contract abi and address;
2. Get the private key of the ropsten account you are using to interact with Capture The Ether. Otherwise, you can't pass the challenge as CTE doesn't know who you are;
3. Get the contract and connect with it using your account;
4. Deploy our FiftyYearsHelper contract and fund it with 2 wei;
5. Call `upsert` a first time to prepare the `timestamp` overflow;
6. Call `upsert` a second time to set `head` to 0;
7. Kill our FiftyYearsHelper contract;
8. Call `withdraw(2)`;

So, to solve this challange add the required information to the code and run `npx hardhat run scripts/math/deployFiftyYearsHelper.js --network ropsten`. This will deploy our helper contract and run the transactions in order. Don't forget to add your challenge contract address to the `kill` function before deploying.

## ACCOUNTS

### Fuzzy Identity
To solve this challenge we need successfully authenticate as "smarx". The challenge gives us the conditions we need to meet:
1. Have a contract that returns "smarx" when the function `name` is called;
2. That same contract must be deployed at an address that ends with `badc0de`.

Step 1 is pretty simple, we just need a function called `name` that returns `bytes32("smarx")`.
As for step 2, the EVM now has an opcode called `CREATE2` that allows us to deploy a contract to a pre-computed address, provided we give it the contract bytecode and an `uint256 salt` to use. This is probably not what the author had in mind, but we should take advantage of improvements to the EVM.

To achieve step 2, take a look at [this repo](https://github.com/kyrers/contract-factory). It allows you to deploy a factory contract that will use the `CREATE2` opcode to deploy our `FuzzyIdentityHelper` contract to an address that ends with `badc0de`, provided we send the correct salt along with the `FuzzyIdentityHelper` bytecode. This will allow us to solve the challenge. The repository contains instructions on how it should be done.

Our `FuzzyIdentityHelper` contract will have our challenge contract address hardcoded, although it's entirely possible to deploy bytecode with constructor params. It's just that this way is easier and does not require you to change the factory repo code.

So, to recap, here are the steps needed:
1. Deploy the factory contract to the Ropsten network;
2. Get our `FuzzyIdentityHelper` contract bytecode;
3. Determine the salt to use to deploy it to an address ending with `badc0de`. When introducing the needed information in the `findHash.js` script, remember that the `deployerAddress` is the address of the factory contract you deployed on step 1, not your own;
4. Use the factory contract to deploy our `FuzzyIdentityHelper` to the address determined in step 3;
5. Get the `FuzzyIdentityHelper` contract we just deployed;
6. Call the `FuzzyIndentityHelper` `authenticate` function;
7. Win;

So, to solve this challenge first deploy the factory contract. Then, using that same repository, determine which salt to use. 
After that, run `nxp hardhat run scripts/accounts/deployFuzzyIdentityHelper.js --network ropsten`, which will use the factory to deploy our `FuzzyIdentityHelper`, which will authenticate us.

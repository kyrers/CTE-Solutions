# CTE-Solutions
This repo contains solutions for the Capture The Ether challenges. There are plenty of solutions around the web, however the goal of this repo is to solve the challenges locally, i.e avoid Etherscan when possible and just write your code locally.

The `hardhat.config.js` file has a template for ropsten network interaction.

[Warmup challenges;](#warmup)

[Lottery challenges;](#lottery)

[Math challenges;](#math)

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
# CTE-Solutions
This repo contains solutions for the Capture The Ether challenges. There are plenty of solutions around the web, however the goal of this repo is to solve the challenges locally, i.e avoid Etherscan when possible and just write your code locally.

The `hardhat.config.js` file has a template for ropsten network interaction.

[Warmup challenges;](#warmup)

[Lottery challenges;](#lottery)

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
2. This time we only have the hash of the number we need to send to the `guess()` function. We need to figure out the number by running an loop, hashing the current loop counter value and then check if the hash matches. You probably saw that the `guess()` function takes an `uint8` as a parameter. This tells us that the number is less than 256, because the `uint8` max value is `2⁸-1 = 255`;
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
3. When we have the correct number, we just need to call the `guess()` function and send 1 ETH to it again.

So, to solve this challenge just add the required information to the code and run `npx hardhat run scripts/lottery/guessTheRandomNumber.js --network ropsten`.



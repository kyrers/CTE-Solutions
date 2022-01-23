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


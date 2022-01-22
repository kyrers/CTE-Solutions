# CTE-Solutions
This repo contains solutions for the Capture The Ether challenges. There are plenty of solutions around the web, however the goal of this repo is to solve the challenges locally, i.e avoid Etherscan when possible and just write your code locally.

The `hardhat.config.js` file has a template for ropsten network interaction.

[Challenges Call Me/ Set Nickname;](#call-meset-nickname)

## WARMUP

### Call Me/Set Nickname
Call Me and Set Nickname are very similar, so there is only code for the more complex one - Set Nickname. 
In the code. you will find the script `setNickname.js`. The code has comments explaining what each line does. Still, here is what we need to do:
1. Get the contract abi and address;
2. Get the private key of the ropsten account you are using to interact with Capture The Ether. Otherwise, you can't pass the challenge as CTE doesn't know who you are;
3. Get the contract and connect with it using your account;
4. Call the `setNickname` function sending the nickname you want as a parameter; For the Call Me challenge, it's even easier, as the function requires no parameters.

So, to solve this challenge just add the required information to the code and run `npx hardhat run scripts/setNickname.js --network ropsten`.

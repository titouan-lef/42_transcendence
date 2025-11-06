# How to Deploy the Smart Contract

First, create a new folder and install the required tools:

```bash
mkdir DeploySmartContract
cd DeploySmartContract
npm init -y
npm install --save-dev hardhat@^2.22.5 @nomicfoundation/hardhat-toolbox typescript ts-node chai @types/chai @types/mocha dotenv
```

Then, start Hardhat to set up a TypeScript project:

```bash
npx hardhat
888    888                      888 888               888
888    888                      888 888               888
888    888                      888 888               888
8888888888  8888b.  888d888 .d88888 88888b.   8888b.  888888
888    888     "88b 888P"  d88" 888 888 "88b     "88b 888
888    888 .d888888 888    888  888 888  888 .d888888 888
888    888 888  888 888    Y88b 888 888  888 888  888 Y88b.
888    888 "Y888888 888     "Y88888 888  888 "Y888888  "Y888

Welcome to Hardhat v2.26.5

✔ What do you want to do? · Create a TypeScript project
✔ Hardhat project root: · /home/pchalmin/HardhatEloProject
✔ Do you want to add a .gitignore? (Y/n) · y
```

You should now have the following files and folders:

```bash
ls
contracts  hardhat.config.ts  ignition  node_modules  package.json  package-lock.json  README.md  test  tsconfig.json
```

Replace the file ./contracts/Lock.sol with the EloStorage.sol file from the blockchain folder.
Replace the file ./test/Lock.ts with EloStorage.test.ts from the same blockchain folder.

Create a scripts directory:

```bash
mkdir scripts
```

Inside it, add the file deploy.ts and the interact folder containing the files:
getElo.ts, setElo.ts, updateElo.ts, and showPlayers.ts.

Also, replace the hardhat.config.ts file with the one from the blockchain folder.

Create a .env file with the following content:

```env
PRIVATE_KEY=<your wallet>
AVVALANCHE_RPC_URL=https://api.avax-test.network/ext/bc/C/rpc
CONTRACT_ADDRESS=<adress of your contract when you deploy on your local or test chain>
```

Next, compile the Smart Contract with:

```bash
npx hardhat compile
[dotenv@17.2.3] injecting env (3) from .env -- tip: 🛠️  run anywhere with `dotenvx run -- yourcommand`
Generating typings for: 1 artifacts in dir: typechain-types for target: ethers-v6
Successfully generated 6 typings!
Compiled 1 Solidity file successfully (evm target: paris).
```

Then, run the test files (written in TypeScript) located in the test folder to verify that everything works correctly:

```bash
npx hardhat test
[dotenv@17.2.3] injecting env (3) from .env -- tip: ⚙️  write to custom object with { processEnv: myObject }


  EloStorage
    ✔ set/get/update ELO for multiple users


  1 passing (43ms)

·············································································································
|  Solidity and Network Configuration                                                                       │
························|·················|···············|·················|································
|  Solidity: 0.8.20     ·  Optim: false   ·  Runs: 200    ·  viaIR: false   ·     Block: 30,000,000 gas     │
························|·················|···············|·················|································
|  Methods                                                                                                  │
························|·················|···············|·················|················|···············
|  Contracts / Methods  ·  Min            ·  Max          ·  Avg            ·  # calls       ·  usd (avg)   │
························|·················|···············|·················|················|···············
|  EloStorage           ·                                                                                   │
························|·················|···············|·················|················|···············
|      setElo           ·              -  ·            -  ·         45,993  ·             5  ·           -  │
························|·················|···············|·················|················|···············
|      updateElo        ·         29,250  ·       29,788  ·         29,473  ·             4  ·           -  │
························|·················|···············|·················|················|···············
|  Deployments                            ·                                 ·  % of limit    ·              │
························|·················|···············|·················|················|···············
|  EloStorage           ·              -  ·            -  ·        443,583  ·         1.5 %  ·           -  │
························|·················|···············|·················|················|···············
|  Key                                                                                                      │
·············································································································
|  ◯  Execution gas for this method does not include intrinsic gas overhead                                 │
·············································································································
|  △  Cost was non-zero but below the precision setting for the currency display (see options)              │
·············································································································
|  Toolchain:  hardhat                                                                                      │
·············································································································
```

If everything passes successfully, you can deploy the Smart Contract to the local Hardhat blockchain.

In one terminal, start the local Hardhat network:

```bash
npx hardhat node
[dotenv@17.2.3] injecting env (3) from .env -- tip: 🔐 prevent building .env in docker: https://dotenvx.com/prebuild
Started HTTP and WebSocket JSON-RPC server at http://127.0.0.1:8545/

Accounts
========

WARNING: These accounts, and their private keys, are publicly known.
Any funds sent to them on Mainnet or any other live network WILL BE LOST.

Account #0: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 (10000 ETH)
Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

Account #1: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 (10000 ETH)
Private Key: 0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d

Account #2: 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC (10000 ETH)
Private Key: 0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a

[...]

WARNING: These accounts, and their private keys, are publicly known.
Any funds sent to them on Mainnet or any other live network WILL BE LOST.
```

In another terminal, deploy the Smart Contract:

```bash
npx hardhat run scripts/deploy.ts --network localhost
[dotenv@17.2.3] injecting env (3) from .env -- tip: 🔑 add access controls to secrets: https://dotenvx.com/ops
[dotenv@17.2.3] injecting env (0) from .env -- tip: 👥 sync secrets across teammates & machines: https://dotenvx.com/ops
EloStorage deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3 //copier ceci dans le .env
```

Once deployed locally, you can interact with the contract to verify that it works correctly:

```bash
npx hardhat run scripts/interact/setElo.ts --network localhost
npx hardhat run scripts/interact/getElo.ts --network localhost
npx hardhat run scripts/interact/updateElo.ts --network localhost
npx hardhat run scripts/interact/showPlayers.ts --network localhost
```

If everything works properly, you can deploy the Smart Contract to the Avalanche Fuji Testnet:

```bash
npx hardhat run scripts/deploy.ts --network fuji
[dotenv@17.2.3] injecting env (3) from .env -- tip: 🔑 add access controls to secrets: https://dotenvx.com/ops
[dotenv@17.2.3] injecting env (0) from .env -- tip: 👥 sync secrets across teammates & machines: https://dotenvx.com/ops
EloStorage deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3 //copier ceci dans le .env
```

Finally, you can interact directly with the testnet blockchain using the following commands:

```bash
npx hardhat run scripts/interact/setElo.ts --network fuji
npx hardhat run scripts/interact/getElo.ts --network fuji
npx hardhat run scripts/interact/updateElo.ts --network fuji
npx hardhat run scripts/interact/showPlayers.ts --network fuji
```

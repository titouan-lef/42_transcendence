# Comment déployer le smart contract

Tous d'abord il faut créer un dossier et installer les outils necessaire :

```bash
mkdir DeploySmartContract
cd DeploySmartContract
npm init -y
npm install --save-dev hardhat@^2.22.5 @nomicfoundation/hardhat-toolbox typescript ts-node chai @types/chai @types/mocha dotenv
```

Puis lancer hardhat pour un project TypeScript:

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

Nous obtenons les dossier et fichier suivant :

```bash
ls
contracts  hardhat.config.ts  ignition  node_modules  package.json  package-lock.json  README.md  test  tsconfig.json
```

Remplacer le fichier `./contracts/Lock.sol` par le fichier `EloStorage.sol` présent dans le dossier `blockchain`
Remplacer le fichier `./test/Lock.ts` par le fichier `EloStorage.test.ts` présent dans le dossier `blockchain`

Créer un dossier scripts

```bash
mkdir scripts
```

Y mettre dedans le fichier `deploy.ts` et le dossier interact avec les fichiers `getElo.ts`, `setElo.ts`, `updateElo.ts` et `showPlauers.ts`.

Et remplacer le fichier `hardhat.config.ts` par le fichier `hardhat.config.ts` présent dans le dossier blockchain

Créer un fichier `.env`

```env
PRIVATE_KEY=<your wallet>
AVVALANCHE_RPC_URL=https://api.avax-test.network/ext/bc/C/rpc
CONTRACT_ADDRESS=<adress of your contract when you deploy on your local or test chain>
```

Ensuite lancer la commande `npx hardhat compile` pour compiler le Smart Contract:

```bash
npx hardhat compile
[dotenv@17.2.3] injecting env (3) from .env -- tip: 🛠️  run anywhere with `dotenvx run -- yourcommand`
Generating typings for: 1 artifacts in dir: typechain-types for target: ethers-v6
Successfully generated 6 typings!
Compiled 1 Solidity file successfully (evm target: paris).

```

Puis lancer la commande npx hardhat test pour lancer les fichier de test en ts présent dans le dossier test, sur le Smart Contract compiler:

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

Si tous cela est validé, vous pouvez lancer la commande pour deployer le Smart Contract sur la blockchain local de hardhat.

Un terminal ou vous lancer la commande :

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

Puis sur un autre terminal :

```bash
npx hardhat run scripts/deploy.ts --network localhost
[dotenv@17.2.3] injecting env (3) from .env -- tip: 🔑 add access controls to secrets: https://dotenvx.com/ops
[dotenv@17.2.3] injecting env (0) from .env -- tip: 👥 sync secrets across teammates & machines: https://dotenvx.com/ops
EloStorage deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3 //copier ceci dans le .env
```

Si le deployement se passe bien en local vous pouvez interagir avec pour verifier son bon fonctionnement.

```bash
npx hardhat run scripts/interact/setElo.ts --network localhost
npx hardhat run scripts/interact/getElo.ts --network localhost
npx hardhat run scripts/interact/updateElo.ts --network localhost
npx hardhat run scripts/interact/showPlayers.ts --network localhost
```

Si tout fonctionne correctement vous pouvez deployer le Smart Contract sur le testnet d' Avalanche (Fuji testnet).

```bash
npx hardhat run scripts/deploy.ts --network fuji
[dotenv@17.2.3] injecting env (3) from .env -- tip: 🔑 add access controls to secrets: https://dotenvx.com/ops
[dotenv@17.2.3] injecting env (0) from .env -- tip: 👥 sync secrets across teammates & machines: https://dotenvx.com/ops
EloStorage deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3 //copier ceci dans le .env
```

Puis vous pouvez interagir directement avec la blockchain de test avec les commande suivante :

```bash
npx hardhat run scripts/interact/setElo.ts --network fuji
npx hardhat run scripts/interact/getElo.ts --network fuji
npx hardhat run scripts/interact/updateElo.ts --network fuji
npx hardhat run scripts/interact/showPlayers.ts --network fuji
```

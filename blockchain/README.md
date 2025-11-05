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

Account #3: 0x90F79bf6EB2c4f870365E785982E1f101E93b906 (10000 ETH)
Private Key: 0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6

Account #4: 0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65 (10000 ETH)
Private Key: 0x47e179ec197488593b187f80a00eb0da91f1b9d0b13f8733639f19c30a34926a

Account #5: 0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc (10000 ETH)
Private Key: 0x8b3a350cf5c34c9194ca85829a2df0ec3153be0318b5e2d3348e872092edffba

Account #6: 0x976EA74026E726554dB657fA54763abd0C3a0aa9 (10000 ETH)
Private Key: 0x92db14e403b83dfe3df233f83dfa3a0d7096f21ca9b0d6d6b8d88b2b4ec1564e

Account #7: 0x14dC79964da2C08b23698B3D3cc7Ca32193d9955 (10000 ETH)
Private Key: 0x4bbbf85ce3377467afe5d46f804f221813b2bb87f24d81f60f1fcdbf7cbf4356

Account #8: 0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f (10000 ETH)
Private Key: 0xdbda1821b80551c9d65939329250298aa3472ba22feea921c0cf5d620ea67b97

Account #9: 0xa0Ee7A142d267C1f36714E4a8F75612F20a79720 (10000 ETH)
Private Key: 0x2a871d0798f97d79848a013d4936a73bf4cc922c825d33c1cf7073dff6d409c6

Account #10: 0xBcd4042DE499D14e55001CcbB24a551F3b954096 (10000 ETH)
Private Key: 0xf214f2b2cd398c806f84e317254e0f0b801d0643303237d97a22a48e01628897

Account #11: 0x71bE63f3384f5fb98995898A86B02Fb2426c5788 (10000 ETH)
Private Key: 0x701b615bbdfb9de65240bc28bd21bbc0d996645a3dd57e7b12bc2bdf6f192c82

Account #12: 0xFABB0ac9d68B0B445fB7357272Ff202C5651694a (10000 ETH)
Private Key: 0xa267530f49f8280200edf313ee7af6b827f2a8bce2897751d06a843f644967b1

Account #13: 0x1CBd3b2770909D4e10f157cABC84C7264073C9Ec (10000 ETH)
Private Key: 0x47c99abed3324a2707c28affff1267e45918ec8c3f20b8aa892e8b065d2942dd

Account #14: 0xdF3e18d64BC6A983f673Ab319CCaE4f1a57C7097 (10000 ETH)
Private Key: 0xc526ee95bf44d8fc405a158bb884d9d1238d99f0612e9f33d006bb0789009aaa

Account #15: 0xcd3B766CCDd6AE721141F452C550Ca635964ce71 (10000 ETH)
Private Key: 0x8166f546bab6da521a8369cab06c5d2b9e46670292d85c875ee9ec20e84ffb61

Account #16: 0x2546BcD3c84621e976D8185a91A922aE77ECEc30 (10000 ETH)
Private Key: 0xea6c44ac03bff858b476bba40716402b03e41b8e97e276d1baec7c37d42484a0

Account #17: 0xbDA5747bFD65F08deb54cb465eB87D40e51B197E (10000 ETH)
Private Key: 0x689af8efa8c651a91ad287602527f3af2fe9f6501a7ac4b061667b5a93e037fd

Account #18: 0xdD2FD4581271e230360230F9337D5c0430Bf44C0 (10000 ETH)
Private Key: 0xde9be858da4a475276426320d5e9262ecfc3ba460bfac56360bfa6c4c28b4ee0

Account #19: 0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199 (10000 ETH)
Private Key: 0xdf57089febbacf7ba0bc227dafbffa9fc08a93fdc68e1e42411a14efcf23656e

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

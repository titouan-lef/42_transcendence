import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

dotenv.config();

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const AVALANCHE_RPC_URL = process.env.AVALANCHE_RPC_URL;

const config: HardhatUserConfig = {
	solidity: "0.8.30",
	networks: {
	hardhat: {},
	fuji: {
		url: AVALANCHE_RPC_URL || "",
		accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
		chainId: 43113,
	},
	},
};

export default config;

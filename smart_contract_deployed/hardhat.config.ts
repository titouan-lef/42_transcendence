import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
	solidity: "0.8.20",
	networks: {
		fuji: {
			url: process.env.AVALANCHE_RPC_URL || "",
			accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
			chainId: 43113
		},
		mainnet: {
			url: process.env.AVALANCHE_MAINNET_RPC_URL || "",
			accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
			chainId: 43114
		}
	}
};

export default config;
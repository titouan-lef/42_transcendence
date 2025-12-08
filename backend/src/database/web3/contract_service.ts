import { ethers, Contract, JsonRpcProvider, Wallet } from 'ethers';
import { ABI } from "./EloStorageAbi.js";
import * as dotenv from 'dotenv';

dotenv.config();

const RPC_URL = process.env.RPC_URL;
if (!RPC_URL) {
	throw new Error("Missing RPC_URL in .env");
}

const PROVIDER = new JsonRpcProvider(RPC_URL);

/** Get Signer status */
let signer: Wallet | undefined = undefined;

if (!process.env.PRIVATE_KEY)
	throw new Error("Missing PRIVATE_KEY in .env");
signer = new Wallet(process.env.PRIVATE_KEY, PROVIDER);

/** Get Contract Adress */
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
if (!CONTRACT_ADDRESS)
	throw new Error("Missing CONTRACT_ADDRESS in .env");

/**
 * @brief Instantiate the SmartContract for acces to :
 * @function setEloData(string memory username, uint256 season, uint256 rating, uint256 ratingRd)
 * @function setRatingRd(string memory username, uint256 season, uint256 ratingRd)
 * @function setRating(string memory username, uint256 season, uint256 rating)
 * @function getEloData(string memory username, uint256 season) returns (uint256 rating, uint256 ratingRd)
 *  */
const CONTRACT = new Contract(CONTRACT_ADDRESS, ABI, signer);

export { CONTRACT };

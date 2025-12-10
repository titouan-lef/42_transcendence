import { parseUnits, formatUnits, Contract, JsonRpcProvider, Wallet, TransactionResponse } from 'ethers';
import { ABI } from "./EloStorageAbi.js";
import * as dotenv from 'dotenv';

dotenv.config();

interface Elo {
	rating: number;
	ratingDeviation: number;
}

const DECIMALS = 10**6;
const DECIMALS_COUNT = 6;

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
 * @function setEloData(string memory username, uint256 season, uint256 rating, uint256 ratingDeviation)
 * @function setRatingDeviation(string memory username, uint256 season, uint256 ratingDeviation)
 * @function setRating(string memory username, uint256 season, uint256 rating)
 * @function getEloData(string memory username, uint256 season) returns (uint256 rating, uint256 ratingDeviation)
 *  */
const CONTRACT = new Contract(CONTRACT_ADDRESS, ABI, signer);

let transactionLock = Promise.resolve();

async function sendTransactionSafe(contractCall: (...args: unknown[]) => Promise<TransactionResponse>, args: unknown[]): Promise<void>  {
	transactionLock = transactionLock.then(async () => {
		try {
			const tx = await contractCall(...args);
			await tx.wait(); 
		} catch (error) {
			console.error("Error during serial transmission of the transaction. The nonce should have been correct.");
			console.error(error);
			throw error;
		}
	});
	await transactionLock; 
}

async function setElo(username: string, season: number, rating: number, ratingDeviation: number): Promise<void> {
	const scaledRatingDeviation = parseUnits(ratingDeviation.toString(), DECIMALS_COUNT);
	await sendTransactionSafe(
		CONTRACT.setEloData.bind(CONTRACT),
		[username, season, rating, scaledRatingDeviation]
	);
}

async function setRating(username: string, season: number, rating: number): Promise<void> {
	await sendTransactionSafe(
		CONTRACT.setRating.bind(CONTRACT),
		[username, season, rating]
	);
}

async function setRatingDeviation(username: string, season: number, ratingDeviation: number): Promise<void> {
	const scaledRatingDeviation = parseUnits(ratingDeviation.toString(), DECIMALS_COUNT);
	await sendTransactionSafe(
		CONTRACT.setRatingDeviation.bind(CONTRACT),
		[username, season, scaledRatingDeviation]
	);
}

async function getElo(username: string, season:number): Promise<Elo> {
	
	const [scaleRating, scaledRatingDeviation]: [bigint, bigint] = await CONTRACT.getEloData(username, season);
	const unscaledRating = Number(scaleRating);
	const unscaledRatingDeviation = Number(scaledRatingDeviation) / DECIMALS;
	const elo: Elo = {
		rating : unscaledRating,
		ratingDeviation : unscaledRatingDeviation,
	};
	return elo;
}

export { setElo, setRating, setRatingDeviation, getElo, Elo };

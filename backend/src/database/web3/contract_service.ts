import { parseUnits, Contract, JsonRpcProvider, Wallet, TransactionResponse } from 'ethers';
import { ABI } from "./EloStorageAbi.js";
import * as dotenv from 'dotenv';
import { Elo } from '../../tournament/elo/elo.js';
import { getSeasonLastGame } from '../game.js';
import { wait } from '../../utils/time.js';

interface EloInfo {
	username: string,
	season: number,
	elo: Elo,
};

interface RdInfo {
	username: string,
	season: number,
	rd: number,
};

const DECIMALS = 10**6;
const DECIMALS_COUNT = 6;
const QUEUE_ELO: EloInfo[] = [];
const QUEUE_RD: RdInfo[] = [];

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
 * @function resetAll() public onlyOwner;
 * @function setEloData(string memory username, uint256 season, uint256 rating, uint256 ratingDeviation) public onlyOwner;
 * @function setRatingDeviation(string memory username, uint256 season, uint256 ratingDeviation) public onlyOwner;
 * @function getEloData(string memory username, uint256 season) public view returns (uint256 rating, uint256 ratingDeviation);
 * @function getAllRatingBySeason(string[] memory usernames, uint256 season) public view returns (uint256[] memory);
 */
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
		}
	});
	await transactionLock; 
}

async function resetEloStorage(): Promise<void> {
	await sendTransactionSafe(
		CONTRACT.resetAll.bind(CONTRACT),
		[]
	);
}

/**
 * Manage Blockchain.
 * @warning Must be run when the server starts up and must not be awaited.
 */
async function blockchainManagement(): Promise<void> {
	while (true) {
		while (QUEUE_ELO.length !== 0) {
			await writeEloInBlockchain(QUEUE_ELO[0]);
			QUEUE_ELO.shift();
		}
		while (QUEUE_RD.length !== 0) {
			await writeRdInBlockchain(QUEUE_RD[0]);
			QUEUE_RD.shift();
		}
		await wait(100);
	}
}

async function writeEloInBlockchain(eloInfo: EloInfo): Promise<void> {
	const scaledRatingDeviation = parseUnits(eloInfo.elo.rd.toString(), DECIMALS_COUNT);
	await sendTransactionSafe(
		CONTRACT.setEloData.bind(CONTRACT),
		[eloInfo.username, eloInfo.season, eloInfo.elo.r, scaledRatingDeviation]
	);
}

async function writeRdInBlockchain(rdInfo: RdInfo): Promise<void> {
	const scaledRatingDeviation = parseUnits(rdInfo.rd.toString(), DECIMALS_COUNT);
	await sendTransactionSafe(
		CONTRACT.setRatingDeviation.bind(CONTRACT),
		[rdInfo.username, rdInfo.season, scaledRatingDeviation]
	);
}

function setElo(username: string, season: number, elo: Elo): void {
	QUEUE_ELO.push({ username: username, season: season, elo: elo });
}

function setRatingDeviation(username: string, season: number, rd: number): void {
	QUEUE_RD.push({ username: username, season: season, rd: rd });
}

async function getElo(username: string, season?: number): Promise<Elo> {
	if (!season) {
		season = await getSeasonLastGame(username);
		if (!season)
			return ({ r: 0, rd: 0 });
	}
	const [scaleRating, scaledRatingDeviation]: [bigint, bigint] = await CONTRACT.getEloData(username, season);
	const unscaledRating = Number(scaleRating);
	const unscaledRatingDeviation = Number(scaledRatingDeviation) / DECIMALS;
	const elo: Elo = {
		r : unscaledRating,
		rd : unscaledRatingDeviation,
	};
	return elo;
}

async function getAllRatingBySeason(usernames: string[], season: number): Promise<number[]> {
	const allRating: bigint[] = await CONTRACT.getAllRatingBySeason(usernames, season);
	const allRatingInNumber: number[] = [];
	for(const rating of allRating) {
		allRatingInNumber.push(Number(rating));
	}
	return (allRatingInNumber);
}

export { setElo, setRatingDeviation, getElo, resetEloStorage, getAllRatingBySeason, blockchainManagement };

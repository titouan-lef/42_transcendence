import { parseUnits, formatUnits, Contract, JsonRpcProvider, Wallet } from 'ethers';
import { ABI } from "./EloStorageAbi.js";
import * as dotenv from 'dotenv';

dotenv.config();

interface Elo {
	rating: number;
	ratingRd: number;
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
 * @function setEloData(string memory username, uint256 season, uint256 rating, uint256 ratingRd)
 * @function setRatingRd(string memory username, uint256 season, uint256 ratingRd)
 * @function setRating(string memory username, uint256 season, uint256 rating)
 * @function getEloData(string memory username, uint256 season) returns (uint256 rating, uint256 ratingRd)
 *  */
const CONTRACT = new Contract(CONTRACT_ADDRESS, ABI, signer);

async function setElo(username: string, season: number, rating: number, ratingRd: number): Promise<void> {
	const scaledRatingRd = parseUnits(ratingRd.toString(), DECIMALS_COUNT);
	await CONTRACT.setEloData(username, season, rating, scaledRatingRd);
}

async function setRatingRd(username: string, season: number, ratingRd: number): Promise<void> {
	const scaledRatingRd = parseUnits(ratingRd.toString(), DECIMALS_COUNT);
	await CONTRACT.setRatingRd(username, season, scaledRatingRd);
}

async function setRating(username: string, season: number, rating: number): Promise<void> {
	await CONTRACT.setRatingRd(username, season, rating);
}

async function getElo(username: string, season:number): Promise<Elo> {
	
	const [scaleRating, scaledRatingRd]: [bigint, bigint] = await CONTRACT.getEloData(username, season);
	const unscaledRating = Number(scaleRating);
	const unscaledRatingRd = Number(scaledRatingRd) / DECIMALS;
	const elo: Elo = {
		rating : unscaledRating,
		ratingRd : unscaledRatingRd,
	};
	return elo;
}

export { setElo, setRating, setRatingRd, getElo, Elo };

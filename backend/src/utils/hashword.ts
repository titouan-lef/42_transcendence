import { scryptSync, randomBytes } from "crypto";

function encrypt(input: string, salt: string): string {
	return scryptSync(input, salt, 32).toString('hex') + salt;
}

function hashword(input: string): string {
	return encrypt(input, randomBytes(16).toString('hex'));
}

function verifyPassword(input: string, hash: string): boolean {
	const toVerify = encrypt(input, hash.slice(64));

	return hash === toVerify;
}

export { hashword, verifyPassword };

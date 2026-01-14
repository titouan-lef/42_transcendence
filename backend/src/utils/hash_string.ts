import { scryptSync, randomBytes, timingSafeEqual } from "crypto";

function encrypt(input: string, salt: string): string {
	const hashLen = 32;

	return scryptSync(input, salt, hashLen).toString('hex') + salt;
}

/**
 * Transforms input into an hashed hexadecimal string with random salt.
 * @param input password to hash
 * @returns hexadecimal encrypted password
 */
function hashString(input: string): string {
	const saltLen = 16;

	return encrypt(input, randomBytes(saltLen).toString('hex'));
}

/**
 * Using same method to encrypt new input to compare with hash.
 * @param input password to verify
 * @param hash hashed true password
 * @returns true if encrypted input is exactly the same as the hashed password
 */
function isValidHashedPassword(input: string, hash: string): boolean {
	const saltPos = 64;

	const toVerify = encrypt(input, hash.slice(saltPos));
	const hashBuffer = Buffer.from(hash, "hex");
	const verifyBuffer = Buffer.from(toVerify, "hex");

	if (hashBuffer.length !== verifyBuffer.length) { // Avoids timingSafeEqual to fail.
		return false;
	}

	return timingSafeEqual(hashBuffer, verifyBuffer);
}

export { hashString, isValidHashedPassword };

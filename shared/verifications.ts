const NAME_CHAR_MAX = 10;
const PASSWORD_CHAR_MAX = 20;
const PASSWORD_CHAR_MIN = 8;

/**************************************************************************
 *		REGEX Explanations
 * ^ 				— Start of string
 * !				— Negation
 * [...]			— Character class
 * ^ inside [...]	— Negation -> match any character EXCEPT those listed
 * \s 				— Whitespace
 * {min, max}		— Precise the number min and max of chars
 * $				— End of string anchor
 **************************************************************************/

/**
 * Check for any CR/LF injection
 * Reject whitespaces
 */
function isSafe(str: string): boolean {
	return !/[\r\n\s]/.test(str);
}

function hisSpecial(c: string): boolean {
	return (c >= '!' && c <= '/') ||
		(c >= ':' && c <= '@') ||
		(c >= '[' && c <= '`') ||
		(c >= '{' && c <= '~');
}

function hasForbiddenSpecial(str: string): boolean {
	for (const c of str) {
		if (c === '-' || c === '_' || c === '.') // allowed
			continue;
		if (hisSpecial(c))
			return true;
	}
	return false;
}

function isValidEmail(email: string): boolean {
	if (isSafe(email)) {
		const emailPart = email.split('@');
		if (!emailPart || emailPart.length !== 2)
			return false;
		const localPart = emailPart.at(0) ?? "";
		const domain = emailPart.at(1) ?? "";
		if (localPart.length < 1 || localPart.length > 64 || domain.length < 1 || domain.length > 255)
			return false;
		if (hasForbiddenSpecial(localPart) || hasForbiddenSpecial(domain))
			return false;
		const isValidFormat = /^[^@]+@[^@]+\.[^@]+$/.test(email);
		return isValidFormat;
	}
	return false;
}

function isValidName(username: string): boolean {
	if (isSafe(username)) {
		const special = hasForbiddenSpecial(username);
		const isNotOnlyANumber = /^(?!\d+$).+$/.test(username);
		return !special && isNotOnlyANumber && username.length <= NAME_CHAR_MAX;
	}
	return false;
}

function isValidPassword(password: string): boolean {
	if (password.length < PASSWORD_CHAR_MIN || password.length > PASSWORD_CHAR_MAX)
		return false;
	if (!isSafe(password))
		return false;
	let hasLower = false;
	let hasUpper = false;
	let hasNumber = false;
	let hasSpecial = false;

	for (let i = 0; i < password.length; i++) {
		const c = password[i];

		if (c >= 'a' && c <= 'z')
			hasLower = true;
		if (c >= 'A' && c <= 'Z')
			hasUpper = true;
		else if (c >= '0' && c <= '9')
			hasNumber = true;
		else if (hisSpecial(c))
			hasSpecial = true;
	}

	return hasLower && hasUpper && hasNumber && hasSpecial;
}

export { isValidName, isValidPassword, isValidEmail };

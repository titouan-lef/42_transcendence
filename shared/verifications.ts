const NAME_CHAR_MAX = 10;
const PASSWORD_CHAR_MAX = 20;
const PASSWORD_CHAR_MIN = 8;

/**************************************************************************
 *		REGEX Explanations
 * ^ 				— Start of string
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
	return (
		!/[\r\n]/.test(str) &&
		!/\\s/.test(str)
	);
}

function isValidEmail(email: string): boolean {
	if (isSafe(email)) {
		const isValidEmail = /^[^\s@+]{1,64}@[^\s@]{1,249}\.[^\s@]{1,5}$/.test(email);
		return isValidEmail;
	}
	return false;
}

function isValidName(username: string): boolean {
	if (isSafe(username)) {
		const isNotOnlyANumber = /^(?!\d+$).+$/.test(username);
		return isNotOnlyANumber && username.length <= NAME_CHAR_MAX;
	}
	return false;
}

function isValidPassword(password: string): boolean {
	if (password.length < PASSWORD_CHAR_MIN && length > PASSWORD_CHAR_MAX)
		return false;
	if (!isSafe(password))
		return false;
	let hasUpper = false;
	let hasNumber = false;
	let hasSpecial = false;

	for (let i = 0; i < password.length; i++) {
		const c = password[i];

		if (c >= 'A' && c <= 'Z')
			hasUpper = true;
		else if (c >= '0' && c <= '9')
			hasNumber = true;
		else if (
			(c >= '!' && c <= '/') ||
			(c >= ':' && c <= '@') ||
			(c >= '[' && c <= '`') ||
			(c >= '{' && c <= '~')
		)
			hasSpecial = true;
	}

	return hasUpper && hasNumber && hasSpecial;
}

export { isValidName, isValidPassword, isValidEmail };

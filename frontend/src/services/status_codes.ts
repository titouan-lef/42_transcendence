import { TranslationKey } from "../lang/lang";

enum Success {
	// USERS
	USER_INFOS,
	LOOGED_IN,
	LOOGED_OUT,
	AVATAR_SET, /** @todo remove */
	AVATAR_UPDATED,
	EMAIL_UPDATED,
	USER_CREATED,
	USER_UPDATED,
	// 2FA
	TWOWFA_ENABLED,
	TWOWFA_DISABLED,
	// FRIENDS
	FRIEND_LIST, // object needed
	FRIEND_ADDED,
	FRIEND_REMOVED,
	// GAMES 
	ADDED_TO_QUEUE,
	GAME_FOUND, // object needed

}

enum Errors {
	// USERS - CONNECTION
	REQUEST_FAILED = 200, // Offset of 200 to identyfy easely Success or Error
	WRONG_CREDENTIALS,
	TWOFA_REQUIRED,
	AUTH_REQUIRED,
	NO_SUCH_USER,
	INVALID_TOKEN,
	INVALID_EMAIL,
	NO_USER_GIVEN,
	NO_EMAIL_GIVEN,
	NO_FILE_GIVEN,
	NO_THEME_GIVEN,
	NO_AVATAR,
	NO_DATA_TO_UPDATE,
	USERNAME_TAKEN,
	// 2FA
	INVALID_2FA_CODE,
	ALREADY_ENABLED,
	ALREADY_DISABLED,
	EMAIL_REQUIRED,
	DISABLE_2FA,
	// FRIENDS
	NO_FRIEND_GIVEN,
	FRIEND_HIMSELF,
	ALREADY_FRIEND_WITH,
	NOT_FRIEND_WITH,
	// GAMES
	ALREADY_IN_QUEUE,
	GAME_NOT_FOUND,
	GAME_NOT_FOUND_YET
}

type ReplyStatus = Success | Errors;

const REPLY_MESSAGES: Partial<Record<ReplyStatus, TranslationKey>> = {
	// USERS | CONNECTION
	[Errors.WRONG_CREDENTIALS]: "wrong_creadentials",
	[Errors.TWOFA_REQUIRED]: "twofa_required",
	[Errors.AUTH_REQUIRED]: "not_connected",
	[Errors.NO_SUCH_USER]: "no_such_user",
	[Errors.USERNAME_TAKEN]: "username_taken",
	[Errors.NO_DATA_TO_UPDATE]: "nothing_updated",
	[Errors.INVALID_EMAIL]: "invalid_email",

	// 2FA
	[Errors.INVALID_2FA_CODE]: "invalid_2fa_code",
	[Errors.EMAIL_REQUIRED]: "email_required",

	// FRIENDS
	[Errors.FRIEND_HIMSELF]: "friend_himself",
	[Errors.ALREADY_FRIEND_WITH]: "already_friend_with",
	[Errors.DISABLE_2FA]: "disable_2FA",
};

export { Success, Errors, ReplyStatus, REPLY_MESSAGES };

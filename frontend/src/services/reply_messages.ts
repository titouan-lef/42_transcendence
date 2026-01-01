import { TranslationKey } from "../lang/lang";
import { Errors, ReplyStatus } from '#shared/status_codes';

const REPLY_MESSAGES: Partial<Record<ReplyStatus, TranslationKey>> = {
	// USERS | CONNECTION
	[Errors.WRONG_CREDENTIALS]: "wrong_creadentials",
	[Errors.TWOFA_REQUIRED]: "twofa_required",
	[Errors.AUTH_REQUIRED]: "not_connected",
	[Errors.NO_SUCH_USER]: "no_such_user",
	[Errors.INVALID_USERNAME]: "invalid_username",
	[Errors.USERNAME_TAKEN]: "username_taken",
	[Errors.NO_DATA_TO_UPDATE]: "nothing_updated",
	[Errors.INVALID_EMAIL]: "invalid_email",

	// 2FA
	[Errors.INVALID_2FA_CODE]: "invalid_2fa_code",
	[Errors.EMAIL_REQUIRED]: "email_required",

	// FRIENDS
	[Errors.FRIEND_HIMSELF]: "friend_himself",
	[Errors.ALREADY_FRIEND_WITH]: "already_friend_with",
	[Errors.DISABLE_2FA]: "please_disable_2FA",
};

export { REPLY_MESSAGES };

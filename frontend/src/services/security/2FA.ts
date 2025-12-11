import { update2FAButton } from "../../pages/modules/profile_settings_2fa";
import { isRequestSuccessfull, printReplyInDiv, sendGetRequestToBack } from "../api_request";

async function enable2FA(): Promise<void> {
	const reply = await sendGetRequestToBack("/api/user/enable-secure");
	if (!isRequestSuccessfull(reply))
		printReplyInDiv(reply, "print-2fa-reply");
	else
		update2FAButton();
}

async function disable2FA(): Promise<void> {
	const reply = await sendGetRequestToBack("/api/user/disable-secure");
	if (!isRequestSuccessfull(reply))
		printReplyInDiv(reply, "print-2fa-reply");
	else
		update2FAButton();
}

export { enable2FA, disable2FA };

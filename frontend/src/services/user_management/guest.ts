import { navigateTo } from "../../routes/navigate";
import { isRequestSuccessfull, printReplyInDiv, sendPostRequestToBack } from "../api_request";
import { guestConnection } from "./user_state";
import { Pages } from "../../routes/navigate_types";
import { NewUserBody } from "#shared/HTTP";

async function guestUser(): Promise<void> {

	const data: NewUserBody = {
		username: 'guest',
		nickname: '', //  will not be used
		password: ''
	};

	const reply = await sendPostRequestToBack("api/user/login", JSON.stringify(data));
	if (!isRequestSuccessfull(reply)) { // should no append !
		printReplyInDiv(reply, "print-content");
		return;
	}

	guestConnection();
	navigateTo(Pages.HOME);
}

export { guestUser };

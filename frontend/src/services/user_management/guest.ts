import { navigateTo } from "src/routes/navigate";
import { isRequestSuccessfull, printReplyInDiv, sendPostRequestToBack } from "../api_request";
import { guestConnection } from "./user_state";
import { Pages } from "src/routes/navigate_types";

async function guestUser(): Promise<void> {

	const data = {
		user: 'guest',
		password: '',
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

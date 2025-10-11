import { addHandler } from "../../routes/events.js";
import { newUser } from "../../user_management/create_account.js";

function userEvents(): void {
	addHandler("new_user", "click", () => newUser());
}

export { userEvents };

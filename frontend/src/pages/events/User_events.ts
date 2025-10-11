import { addHandler } from "../../routes/events.js";
import { newUser } from "../../user_management/create_account.js";
import { connectUser } from "../../user_management/login.js";

function userEvents(): void {
	addHandler("create_new_user", "click", () => newUser());
	addHandler("login", "click", () => connectUser());
}

export { userEvents };

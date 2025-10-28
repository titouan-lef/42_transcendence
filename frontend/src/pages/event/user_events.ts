import { addHandler } from "../../routes/event.js";
import { newUser } from "../../services/user_management/create_account.js";
import { connectUser, disconnectUser } from "../../services/user_management/login.js";

function userEvents(): void {
	addHandler("create_new_user", "click", () => newUser());
	addHandler("login", "click", () => connectUser());
	addHandler("logout", "click", () => disconnectUser());
}

export { userEvents };

import {newUser} from "./user_management/create_account.js";
import {connectUser, disconnectUser, whoami} from "./user_management/login.js";

document.addEventListener("DOMContentLoaded", () => {
	document.getElementById("create_new_user")?.addEventListener("click", newUser);
	document.getElementById("login")?.addEventListener("click", connectUser);
	document.getElementById("logout")?.addEventListener("click", disconnectUser);
	whoami();
});
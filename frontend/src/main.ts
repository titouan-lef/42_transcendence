import {newUser} from "./user_management/create_account.js";
import {connectUser} from "./user_management/login.js";

document.addEventListener("DOMContentLoaded", () => {
	document.getElementById("create_new_user")?.addEventListener("click", newUser);
	document.getElementById("login")?.addEventListener("click", connectUser);
});
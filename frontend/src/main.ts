import {newUser} from "./user_management/create_account.js";

document.addEventListener("DOMContentLoaded", () => {
	document.getElementById("new_user")?.addEventListener("click", newUser);
});
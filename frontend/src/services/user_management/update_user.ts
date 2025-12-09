import { showProfile } from "../../pages/modules/profile_settings.js";

async function updateUser(): Promise<void> {
	/** @todo do update user */
	console.debug('user updated');

	/** @todo do below only if update OK */
	showProfile();
}

export { updateUser };

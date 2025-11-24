/** @todo need a fake user */

import { getSafeElement } from "../../utils/getSafeElement";

function guestUser(): void {
	console.log('user is guested'); /** @todo update guest user */

	const modal = getSafeElement('modal', HTMLDialogElement);

	modal.close();

	/** @todo insert send to back here ? */
}

export { guestUser };

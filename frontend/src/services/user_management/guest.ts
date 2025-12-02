/** @todo need a fake user */

import { getSafeElement } from "../../utils/getSafeElement";

function guestUser(): void {
	const modal = getSafeElement('modal', HTMLDialogElement);

	modal.close();

	/** @todo insert send to back here ? */
}

export { guestUser };

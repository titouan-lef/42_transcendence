import { getSafeElement } from "../../utils/getSafeElement";
import { setActiveBtn } from "./profile";

const HISTORY = `
history
`;

function loadHistory(): void {
	const elem = getSafeElement('profile-content', HTMLElement);

	elem.innerHTML = HISTORY;
	setActiveBtn('btn-history');

	/** @todo events */
}

export { HISTORY, loadHistory };

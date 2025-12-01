import { getSafeElement } from "../../utils/getSafeElement";
import { setActiveBtn } from "./profile";

const SETTINGS = `
settings
`;

function loadSettings(): void {
	const elem = getSafeElement('profile-content', HTMLElement);

	elem.innerHTML = SETTINGS;
	setActiveBtn('btn-settings');

	/** @todo events */
}

export { SETTINGS, loadSettings };

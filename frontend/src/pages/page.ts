import { getSafeElement } from "../utils/getSafeElement.js";

const ELEM_ID = 'main-content';
const ELEM = getSafeElement(ELEM_ID, HTMLElement);

function loadPage(page: string, eventLoader: () => void): void {
	/** @todo clearLangListeners(); */
	ELEM.innerHTML = page;
	eventLoader();
};

export { ELEM, loadPage };

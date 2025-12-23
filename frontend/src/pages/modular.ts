import { ELEM, loadPage } from "../routes/page";
import { getSafeElement } from "../utils/getSafeElement";
import { ASIDE_BOX, loadAside } from "./modules/box/box_aside";
import { MAIN_BOX, mainBoxEvents } from "./modules/box/box_main";
import { exitDialog } from "./modules/dialog/dialog";

const ROW_STYLE = `
flex flex-row gap-[10px]
p-[10px]
min-h-screen max-h-screen
bg-dark
`;

const MODULAR = `
<dialog id="modal"></dialog>
<div id="modular-content" class="${ROW_STYLE}">
	${MAIN_BOX}
	${ASIDE_BOX}
</div>
`;

function loadModularPage(): void {
	ELEM.removeEventListener('click', loadModularPage);
	loadPage(MODULAR, modularEvents);
	loadAside();
}

function modularEvents(): void {
	const modal = getSafeElement('modal', HTMLDialogElement);
	modal.addEventListener('click', (e) => exitDialog(modal, e));

	mainBoxEvents();
}

export { loadModularPage };

import { applyColor } from "src/utils/applyColor";
import { ELEM, loadPage } from "../routes/page";
import { getSafeElement } from "../utils/getSafeElement";
import { ASIDE_BOX, loadAside } from "./modules/box/box_aside";
import { exitDialog } from "./modules/dialog/dialog";
import { loadMainHome } from "./modules/box/box_main_home";

const ROW_STYLE = `
flex flex-row gap-[10px]
p-[10px]
min-h-screen max-h-screen
bg-dark
`;

const MAIN_BOX_STYLE = `
grow
flex justify-center items-center flex-col
rounded-2xl
${applyColor('alt')}
`;

const MAIN_BOX = `
<main id="main-box" class="${MAIN_BOX_STYLE}">
</main>
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
	loadMainHome();
	loadAside();
}

function modularEvents(): void {
	const modal = getSafeElement('modal', HTMLDialogElement);
	modal.addEventListener('click', (e) => exitDialog(modal, e));
}

export { loadModularPage };

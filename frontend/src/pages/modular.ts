import { getSafeElement } from "../utils/getSafeElement";
import { ASIDE_BOX, asideDisconnectedEvents } from "./modules/box_aside";
import { MAIN_BOX, mainBoxEvents } from "./modules/box_main";
import { exitDialog } from "./modules/dialog";

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

function modularEvents(): void {
	const modal = getSafeElement('modal', HTMLDialogElement);
	modal.addEventListener('click', (e) => exitDialog(modal, e));

	asideDisconnectedEvents();
	mainBoxEvents();
}

export { MODULAR, modularEvents };

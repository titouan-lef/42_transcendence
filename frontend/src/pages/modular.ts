import { ELEM, loadPage } from "../routes/page";
import { currentUser, getUserInfos } from "../services/user_management/login";
import { getSafeElement } from "../utils/getSafeElement";
import { ASIDE_BOX, ASIDE_CONNECTED, ASIDE_NOT_CONNECTED, asideConnectedEvents, asideDisconnectedEvents, loadAside } from "./modules/box/box_aside";
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

async function loadModularPage(): Promise<void> {
	if (currentUser)
		await getUserInfos();

	ELEM.removeEventListener('click', loadModularPage);
	loadPage(MODULAR, modularEvents);

	if (currentUser)
		loadAside(ASIDE_CONNECTED, asideConnectedEvents);
	else
		loadAside(ASIDE_NOT_CONNECTED, asideDisconnectedEvents);
}

function modularEvents(): void {
	const modal = getSafeElement('modal', HTMLDialogElement);
	modal.addEventListener('click', (e) => exitDialog(modal, e));

	mainBoxEvents();
}

export { MODULAR, modularEvents, loadModularPage };

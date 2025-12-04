import { ELEM, loadPage } from "../routes/page";
import { sendGetRequestToBack, ServerRes } from "../services/api_request";
import { getSafeElement } from "../utils/getSafeElement";
import { ASIDE_BOX, ASIDE_CONNECTED, ASIDE_NOT_CONNECTED, asideConnectedEvents, asideDisconnectedEvents, loadAside } from "./modules/box_aside";
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

async function loadModularPage(): Promise<void> {
	ELEM.removeEventListener('click', loadModularPage);
	loadPage(MODULAR, modularEvents);

	const whoami = await sendGetRequestToBack("/api/user/whoami");
	if (whoami.status === 200)
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

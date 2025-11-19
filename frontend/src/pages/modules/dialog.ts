import { getSafeElement } from "../../utils/getSafeElement.js";
import { applyColor } from "../../utils/applyColor.js";

const DIALOG_MAIN_STYLE = `
	m-auto p-0 rounded-2xl
	w-full max-w-[500px] h-1/2
	backdrop:bg-white/25 backdrop:backdrop-blur-sm bg-transparent
	shadow-[0_0_25px_0] shadow-shadow
`;

const DIALOG_BOX_STYLE = `
	flex justify-center
	m-auto p-6 rounded-2xl
	h-full w-full
	${applyColor('alt')}
`;

const DIALOG_INNER_STYLE = `
	flex flex-col justify-center items-center gap-4
	min-w-[100px] max-w-[250px]
`;

function loadDialog(handler: (modal: HTMLDialogElement) => void, dialog: string): void {
	const modal = getSafeElement("modal", HTMLDialogElement);

	modal.className = DIALOG_MAIN_STYLE;
	modal.showModal();
	modal.innerHTML = `
		<div class='${DIALOG_BOX_STYLE}'>
			<div class='${DIALOG_INNER_STYLE}'>
				${dialog}
			</div>
		</div>
	`;

	handler(modal);
}

function exitDialog(id: string, modal: HTMLDialogElement, event: Event): void {
	if (event.target === modal) {
		modal.close();
	}
}

export { exitDialog, loadDialog };

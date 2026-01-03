import { applyColor } from "../../../utils/applyColor";
import { getSafeElement } from "../../../utils/getSafeElement";

const MAIN_BOX_BTN_STYLE = `
font-park font-bold
rounded-[10px]
text-[20px]
w-[150px] h-[40px]
${applyColor()}
`;

const MAIN_BOX_SEPARATOR_STYLE = `
	rounded-2xl
	w-1/2
	border-2 border-dark
`;

function loadMainBox(content: string, handler: () => void): void {
	const mainBox = getSafeElement('main-box', HTMLElement);

	mainBox.innerHTML = content;
	handler();
}

export { MAIN_BOX_BTN_STYLE, MAIN_BOX_SEPARATOR_STYLE, loadMainBox };

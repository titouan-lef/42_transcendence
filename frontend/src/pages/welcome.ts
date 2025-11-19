import { ELEM, loadPage } from "../routes/page";
import { applyColor } from "../utils/applyColor";
import { MODULAR, modularEvents } from "./modular";

/** @todo clamp : better responsivity (not working well here) */
const WELCOME_STYLE = `
flex items-center justify-center h-screen
text-[clamp(100px,50vmin,500px)] text-balance
font-jaro font-bold
${applyColor('alt')}
`;

const WELCOME = `
<div class="${WELCOME_STYLE}">
	PONG
</div>
`;

function goToModular(): void {
	ELEM.removeEventListener('click', goToModular);
	loadPage(MODULAR, modularEvents);
}

function welcomeEvents(): void {
	ELEM.addEventListener('click', goToModular);
}

export { WELCOME, welcomeEvents };

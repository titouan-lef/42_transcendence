import { getSafeElement } from "src/utils/getSafeElement";
import { applyColor } from "../utils/applyColor";
import { loadModularPage } from "./modular";
import { ELEM } from "src/routes/page";

/** @todo clamp : better responsivity (not working well here) */
const WELCOME_STYLE = `
flex items-center justify-center h-screen
text-[clamp(100px,50vmin,500px)] text-balance
font-jaro
${applyColor('alt')}
`;

const WELCOME = `
<div class="${WELCOME_STYLE}">
	PONG
</div>
`;

function welcomeEvents(): void {
	ELEM.addEventListener('click', loadModularPage);
}

export { WELCOME, welcomeEvents };

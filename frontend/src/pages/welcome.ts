import { ELEM, loadPage } from "./page";
import { applyColor } from "../utils/applyColor";
import { loadHomePage } from "./modules/box/box_main_home";

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
	ELEM?.addEventListener('click', loadHomePage);
}

function openWelcomePage(): void {
	loadPage(WELCOME, welcomeEvents);
}

export { openWelcomePage };

import { createButtonHtml } from "../../components/button.js";
import { loadPage } from "../../routes/page.js";
import { applyColor } from "../../utils/applyColor.js";
import { getSafeElement } from "../../utils/getSafeElement.js";
import { GAME_PAGE, gamePageEvents } from "../game_page.js";

const MAIN_BOX_STYLE = `
grow
flex justify-center items-center flex-col
rounded-2xl
${applyColor('alt')}
`;

const MAIN_STYLE = `
flex flex-col items-center gap-[10px]
`;

const PONG_STYLE = `
font-jaro
text-[clamp(100px,40vmin,400px)] text-balance leading-none
`;

const PLAY_BTN_STYLE = `
font-park font-bold
rounded-[10px]
text-[20px]
w-[150px] h-[40px]
animate-pulse
${applyColor()}
`;

const MAIN_BOX = `
<main id="main" class="${MAIN_BOX_STYLE}">
	<div class="${MAIN_STYLE}">
		<h1 class="${PONG_STYLE}">PONG</h1>
		${createButtonHtml(["play"], "btn-play", { "class": `${PLAY_BTN_STYLE}` })}
	</div>
</main>
`;

function goToGamePage(): void {
	console.log('lance le jeu si tu es co, sinon ca te propose une page de co');
	loadPage(GAME_PAGE, gamePageEvents);
}

function mainBoxEvents(): void {
	const allElements = getSafeElement('main', HTMLElement).querySelectorAll('*[id]');
	allElements.forEach(elem => {
		switch (elem.id) {
			case 'btn-play':
				elem.addEventListener('click', goToGamePage);
				break;
			default:
				break;
		}
	});
}

export { MAIN_BOX, mainBoxEvents };

import { createButtonHtml } from "../../components/button.js";
import { applyColor } from "../../utils/applyColor.js";

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
		${createButtonHtml(["play"], "main-play-btn", { "class": `${PLAY_BTN_STYLE}` })}
	</div>
</main>
`;

/** @wip changing event */
function mainMenuEvents(): void {
	// addHandler("main-play-btn", "click", () => navigate(PageID.API));
	// addHandler("btn-profile", "click", () => loadDialog(signInHandler, SIGN_IN));
	// addHandler("add-friend", "click", () => addFriend());
	// addHandler("btn-sign-up", "click", () => loadDialog(signUpHandler, SIGN_UP));
	// addHandler("btn-sign-in", "click", () => loadDialog(signInHandler, SIGN_IN));
};

export { MAIN_BOX, mainMenuEvents };

import { addHandler } from "../routes/event.js";
import { PageID, navigate } from "../routes/page.js";

/** @todo clamp : better responsivity (not working well here) */
const CLASS_CSS = `
font-jaro font-bold text-tx-prim bg-primary
text-[clamp(100px,50vmin,500px)] text-balance
flex items-center justify-center h-screen
`;

/** @todo mettre une variable pour les textes (import des langues) ${gameName} */
const WELCOME = `
<div class="${CLASS_CSS}">
	PONG
</div>
`;

// function firstEvents(): void {
// 	addHandler(PageID.FIRST, "click", () => navigate(PageID.MAIN_MENU));
// }

export { WELCOME };

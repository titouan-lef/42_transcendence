import { addHandler } from "../routes/event.js";
import { navigate, PageID } from "../routes/page.js";

const ROW_STYLE = "min-h-screen flex flex-row gap-[10px] p-[10px]";
const MAIN_STYLE = `
grow
rounded-2xl bg-primary
flex justify-center items-center flex-col
`;
const ASIDE_STYLE = `
w-[200px]
grow-0
rounded-2xl bg-primary
`;
const PONG_STYLE = `
font-jaro
text-tx-prim
text-[clamp(100px,40vmin,400px)] text-balance leading-none
`;
const BTN_STYLE = `
font-park font-bold
rounded-[10px] bg-secondary
text-[20px] text-primary
w-[180px] h-[40px]
`;

const MAIN_MENU = `
<div class="${ROW_STYLE}">
	<main class="${MAIN_STYLE}">
		<div class="flex flex-col items-center gap-[10px]">
			<div class="${PONG_STYLE}">
				PONG
			</div>
			<input id="btn-api" type="button" value="play" class="${BTN_STYLE}"/>
		</div>
	</main>
	<aside class="${ASIDE_STYLE}">
		<div>
			droite
			<input id="btn-api" type="button" value="API test" class="btn btn-user"/>
		</div>
	</aside>
</div>
`;

function mainMenuEvents(): void {
	addHandler("btn-api", "click", () => navigate(PageID.API));
};

export { MAIN_MENU, mainMenuEvents };

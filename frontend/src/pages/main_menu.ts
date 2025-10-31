import { addHandler } from "../routes/event.js";
import { navigate, PageID } from "../routes/page.js";

const ROW_STYLE = "min-h-screen flex flex-row gap-[10px] p-[10px] bg-dark";
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
rounded-[10px]
text-[20px] text-primary
w-[150px] h-[40px]
`;

const MAIN_MENU = `
<div class="${ROW_STYLE}">
	<main class="${MAIN_STYLE}">
		<div class="flex flex-col items-center gap-[10px]">
			<h1 class="${PONG_STYLE}">
				PONG
			</h1>
			<input id="btn-api" type="button" value="play" class="${BTN_STYLE} bg-secondary"/>
		</div>
	</main>
	<aside class="${ASIDE_STYLE}">
		<div class="h-full flex flex-col items-center gap-[10px] justify-center">
			<div class="grow-0 rounded-2xl bg-white my-[25px]">
				<img src="./images/avatar.png" alt="Avatar" width="150px" height="150px">
			</div>
			<input id="temp" type="button" value="profile" class="${BTN_STYLE} bg-secondary"/>
			<div class="
			scrollbar-none overflow-y-scroll

			h-[500px] grow w-[150px] rounded-2xl bg-light flex flex-col gap-[10px] items-center justify-start p-[10px]">
				<div class="rounded-2xl bg-primary w-full p-[5px]"><p class="text-center overflow-hidden text-ellipsis" title="ami">ami<p/></div>
				<div class="rounded-2xl bg-secondary w-full p-[5px]"><p class="text-center overflow-hidden text-ellipsis" title="ami">ami<p/></div>
				<div class="rounded-2xl bg-primary w-full p-[5px]"><p class="text-center overflow-hidden text-ellipsis" title="ami">ami<p/></div>
				<div class="rounded-2xl bg-secondary w-full p-[5px]"><p class="text-center overflow-hidden text-ellipsis" title="ami">ami<p/></div>
				<div class="rounded-2xl bg-primary w-full p-[5px]"><p class="text-center overflow-hidden text-ellipsis" title="ami">ami<p/></div>
				<div class="rounded-2xl bg-primary w-full p-[5px]"><p class="text-center overflow-hidden text-ellipsis" title="ami">ami<p/></div>
				<div class="rounded-2xl bg-primary w-full p-[5px]"><p class="text-center overflow-hidden text-ellipsis" title="ami">ami<p/></div>
				<div class="rounded-2xl bg-primary w-full p-[5px]"><p class="text-center overflow-hidden text-ellipsis" title="ami">ami<p/></div>
				<div class="rounded-2xl bg-primary w-full p-[5px]"><p class="text-center overflow-hidden text-ellipsis" title="ami">ami<p/></div>
				<div class="rounded-2xl bg-primary w-full p-[5px]"><p class="text-center overflow-hidden text-ellipsis" title="ami">ami<p/></div>
				<div class="rounded-2xl bg-primary w-full p-[5px]"><p class="text-center overflow-hidden text-ellipsis" title="ami">ami<p/></div>
				<div class="rounded-2xl bg-primary w-full p-[5px]"><p class="text-center overflow-hidden text-ellipsis" title="ami">ami<p/></div>
				<div class="rounded-2xl bg-primary w-full p-[5px]"><p class="text-center overflow-hidden text-ellipsis" title="ami">ami<p/></div>
				<div class="rounded-2xl bg-primary w-full p-[5px]"><p class="text-center overflow-hidden text-ellipsis" title="ami">ami<p/></div>
				<div class="rounded-2xl bg-primary w-full p-[5px]"><p class="text-center overflow-hidden text-ellipsis" title="ami">ami<p/></div>
				<div class="rounded-2xl bg-primary w-full p-[5px]"><p class="text-center overflow-hidden text-ellipsis" title="ami">ami<p/></div>
				<div class="rounded-2xl bg-primary w-full p-[5px]"><p class="text-center overflow-hidden text-ellipsis" title="ami">ami<p/></div>
				<div class="rounded-2xl bg-primary w-full p-[5px]"><p class="text-center overflow-hidden text-ellipsis" title="ami">ami<p/></div>
				<div class="rounded-2xl bg-primary w-full p-[5px]"><p class="text-center overflow-hidden text-ellipsis" title="ami">ami<p/></div>
				<div class="rounded-2xl bg-primary w-full p-[5px]"><p class="text-center overflow-hidden text-ellipsis" title="ami">ami<p/></div>
				<div class="rounded-2xl bg-primary w-full p-[5px]"><p class="text-center overflow-hidden text-ellipsis" title="ami">ami<p/></div>
				<div class="rounded-2xl bg-primary w-full p-[5px]"><p class="text-center overflow-hidden text-ellipsis" title="ami">ami<p/></div>
				<div class="rounded-2xl bg-primary w-full p-[5px]"><p class="text-center overflow-hidden text-ellipsis" title="ami">ami<p/></div>
				<div class="rounded-2xl bg-primary w-full p-[5px]"><p class="text-center overflow-hidden text-ellipsis" title="friend465465465465465465465">friend465465465465465465465<p/></div>
				<div class="rounded-2xl bg-primary w-full p-[5px]"><p class="text-center overflow-hidden text-ellipsis" title="friend465465465465465465465">friend465465465465465465465<p/></div>
			</div>
			<input id="temp" type="button" value="add friend" class="${BTN_STYLE} bg-secondary"/>
			<input id="temp" type="button" value="log out" class="${BTN_STYLE} bg-variant mb-[25px]"/>
		</div>
	</aside>
</div>
`;

function mainMenuEvents(): void {
	addHandler("btn-api", "click", () => navigate(PageID.API));
};

export { MAIN_MENU, mainMenuEvents };

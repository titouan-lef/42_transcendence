import { createButtonHtml } from "../components/button.js";
import { setLang } from "../lang/lang.js";
import { addHandler } from "../routes/event.js";
import { navigate, PageID } from "../routes/page.js";
import { getSafeElement } from "../utils/getSafeElement.js";
import { SIGN_IN, signInHandler } from "./sign_in.js";

const ROW_STYLE = "min-h-screen max-h-screen flex flex-row gap-[10px] p-[10px] bg-dark";
const MAIN_STYLE = `
grow
rounded-2xl bg-primary
flex justify-center items-center flex-col
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
const ASIDE_STYLE = `
w-[200px]
grow-0
rounded-2xl bg-primary
flex
`;
const ASIDE_MAINBOX_STYLE = `
grow flex flex-col items-center gap-[10px] justify-stretch first:mt-[25px] last:mb-[25px]
`;
const AVATAR_STYLE = `
grow-0 rounded-2xl bg-white
`;
const FRIENDLIST_STYLE = `
grow scrollbar-none overflow-y-scroll overflow-hidden
w-[150px] rounded-2xl bg-light
flex flex-col gap-[10px] items-center justify-start p-[10px]
`;

const FRIENDLIST = [
	"friend_1",
	"fd_2",
	"friend_3",
	"friend_4_with_too_long_name",
	"friend_5",
	"friend_6",
	"friendd_7",
];

const DIALOG_STYLE = `
m-auto p-0 rounded-2xl
shadow-[0_0_25px_0] shadow-shadow
backdrop:bg-white/25 backdrop:backdrop-blur-sm bg-transparent
w-full max-w-[500px]
h-1/2
`;

const MAIN_MENU = `
<dialog id="modal" class="${DIALOG_STYLE}">
	${SIGN_IN}
</dialog>
<div class="${ROW_STYLE}">
	<main class="${MAIN_STYLE}">
		<div class="flex flex-col items-center gap-[10px]">
			<h1 class="${PONG_STYLE}">PONG</h1>
			<input id="btn-api" type="button" value="play" class="${BTN_STYLE} bg-secondary"/>
		</div>
	</main>
	<aside id="" class="${ASIDE_STYLE}">
		<div class="${ASIDE_MAINBOX_STYLE}">
			<div class="${AVATAR_STYLE}">
				<img src="./images/avatar.png" alt="Avatar" width="150px" height="150px">
			</div>
			${createButtonHtml(["profile"], `btn-profile`, { "class": `${BTN_STYLE} bg-secondary` })}
			<div id="friendlist" class="${FRIENDLIST_STYLE}">
			</div>
			<input id="add-friend" type="button" value="add friend" class="${BTN_STYLE} bg-secondary"/>
			<input id="temp" type="button" value="log out" class="${BTN_STYLE} bg-variant"/>
		</div>
	</aside>
</div>
`;

//

function generateFriendList(): void {
	const elem = getSafeElement("friendlist", HTMLElement);

	FRIENDLIST.forEach(friend => {
		elem.innerHTML += `
			<details id="${friend}" class="rounded-2xl bg-secondary w-full">
				<summary class="list-none cursor-pointer p-[5px]">
					<p class="text-center overflow-hidden text-ellipsis" title="${friend}">${friend}</p>
				</summary>
				<div class="rounded-xl bg-primary w-auto p-[5px] m-[5px] flex flex-col justify-center items-center">
					${createButtonHtml(["profile"], `btn-profile-${friend}`, { "class": "text-tx-prim text-center w-full" })}
					<button class="text-tx-prim text-center w-full">invite</button>
					<hr class="border-1 border-variant w-full my-1">
					<input id="delete-friend-${friend}" type="button" value="delete" class="text-warning font-bold text-center w-full"/>
				</div>
			</details>
		`;
	});

	FRIENDLIST.forEach(friend => {
		addHandler(`btn-profile-${friend}`, "click", () => console.log(`je consulte le profil de ${friend}`));
		addHandler(`delete-friend-${friend}`, "click", () => console.log(`je delete ${friend}`));
	});
}

function addFriend(): void {
	setLang('fr'); /** @todo remove here */
	console.log("CLICK ADD FRIEND");
	// FRIENDLIST.push("new_friend");
	// generateFriendList();
}

function popLoginPage(): void {
	const modal = getSafeElement("modal", HTMLDialogElement);

	modal.showModal();

	signInHandler(modal);
}

function mainMenuEvents(): void {
	addHandler("btn-api", "click", () => navigate(PageID.API));
	addHandler("btn-profile", "click", () => popLoginPage());
	addHandler("add-friend", "click", () => addFriend());
};

// generateFriendList();

export { MAIN_MENU, mainMenuEvents };

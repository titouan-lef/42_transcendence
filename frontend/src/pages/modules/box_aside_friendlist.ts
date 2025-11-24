/**	@todo friendlist test front bellow, maybe move it to appropriate folder if linked to back */

import { createButtonHtml } from "../../components/button";
import { applyColor } from "../../utils/applyColor";
import { getSafeElement } from "../../utils/getSafeElement";

const FRIENDLIST = [
	"b_friend_1",
	"a_fd_2",
	"friend_3",
	"friend_4_with_too_long_name",
	"friend_5",
	"friend_6",
	"friendd_7",
	"friendd_w7",
	"friendd_d7",
	"friendd_fe7",
	"friendd_e7",
	"friendd_nf7b",
	"friendd_7w",
	"friendd_wwnvb7",
	"friendde_7",
	"friendd_fdvd7",
	"friendd_ce7",
	"friendd_12q7",
	"friendd_xc7",
	"friendd_zzz7",
	"friendd_befbvre7",
	"friendd_vwwwwww7",
];

const DETAILS_STYLE = `
	rounded-2xl
	w-full
	${applyColor()}
`;

const SUM_STYLE = `
	list-none cursor-pointer p-[5px]
`;

const DEPLOYED_STYLE = `
	flex flex-col justify-center items-center
	p-[5px] m-[5px] rounded-xl
	w-auto
	${applyColor('alt')}
`;

const FRIEND_STYLE = `
	text-center overflow-hidden text-ellipsis
`;

const BTN_STYLE = `
	w-full
	text-center
	${applyColor('alt')}
`;

const BTN_DELETE_STYLE = `
	w-full
	text-center
	${applyColor('warning')}
`;

const SEPARATOR_STYLE = `
	my-1 w-full
	border-1 border-variant
`;

/** @todo replace FRIENDLIST and this to fetch all friends from db, keep same generating logic to generate button ids (events) */
function generateFriendList(): void {
	const elem = getSafeElement("friendlist", HTMLElement);
	elem.innerHTML = '';
	FRIENDLIST.sort();

	FRIENDLIST.forEach(friend => {
		elem.innerHTML += `
			<details id="${friend}" class="${DETAILS_STYLE}">
				<summary class="${SUM_STYLE}">
					<p class="${FRIEND_STYLE}" title="${friend}">${friend}</p>
				</summary>
				<div class="${DEPLOYED_STYLE}">
					${createButtonHtml(["profile"], `btn-profile-${friend}`, { "class": `${BTN_STYLE}` })}
					${createButtonHtml(["invite"], `btn-invite-${friend}`, { "class": `${BTN_STYLE}` })}
					<hr class="${SEPARATOR_STYLE}">
					${createButtonHtml(["delete"], `btn-delete-${friend}`, { "class": `${BTN_DELETE_STYLE}` })}
				</div>
			</details>
		`;
	});
	friendsHandler();
}

function closeAllDetails(): void {
	FRIENDLIST.forEach(friend => {
		const elem = getSafeElement(friend, HTMLDetailsElement);

		if (elem.open) {
			elem.open = false;
		}
	});
}

function openProfile(): void {
	console.log('profile openned');
}

function inviteFriend(): void {
	console.log('friend invited');
}

function deleteFriend(): void {
	console.log('friend deleted');
}

function friendsHandler(): void {
	FRIENDLIST.forEach(friend => {
		const allElements = getSafeElement('friendlist', HTMLElement).querySelectorAll('*[id]');

		allElements.forEach(elem => {
			switch (elem.id) {
				case `${friend}`:
					elem.addEventListener('click', closeAllDetails);
					break;
				case `btn-profile-${friend}`:
					elem.addEventListener('click', openProfile);
					break;
				case `btn-invite-${friend}`:
					elem.addEventListener('click', inviteFriend);
					break;
				case `btn-delete-${friend}`:
					elem.addEventListener('click', deleteFriend);
					break;
				default:
					break;
			}
		});
	});
}

export { FRIENDLIST, generateFriendList };

import { getCurrentUserInfos } from "src/services/user_management/user_state";
import { createButtonHtml } from "../../../components/button";
import { isRequestSuccessfull, sendPostRequestToBack } from "../../../services/api_request";
import { applyColor } from "../../../utils/applyColor";
import { getSafeElement } from "../../../utils/getSafeElement";

const FRIENDLIST: string[] = [];

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

async function getFriendList(): Promise<void> {
	const currentUser = getCurrentUserInfos();
	if (!currentUser)
		return;
	FRIENDLIST.length = 0;
	const reply = await sendPostRequestToBack("/api/friends/list", JSON.stringify({ user: currentUser.username }));
	if (!isRequestSuccessfull(reply))
		return;
	const friendList: string[] = JSON.parse(reply.content);
	friendList.forEach(element => {
		FRIENDLIST.push(element);
	});
}

/** @todo keep same generating logic to generate button ids (events) */
async function updateFriendList(): Promise<void> {
	const elem = getSafeElement("friendlist", HTMLElement);
	elem.innerHTML = '';
	await getFriendList();
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
		if (elem.open)
			elem.open = false;
	});
}

function openProfile(): void {
	console.log('profile openned');
}

function inviteFriend(): void { /** @todo we might not do it */
	console.log('friend invited');
}

function deleteFriend(friend: string): void {
	sendPostRequestToBack('/api/friends/remove', JSON.stringify({ user: friend }));
	updateFriendList();
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
					elem.addEventListener('click', () => deleteFriend(friend));
					break;
				default:
					break;
			}
		});
	});
}

export { FRIENDLIST, updateFriendList };

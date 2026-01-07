import { getCurrentUserInfos } from "../../../services/user_management/user_state";
import { createButtonHtml } from "../../../components/button";
import { isRequestSuccessfull, sendPostRequestToBack } from "../../../services/api_request";
import { applyColor } from "../../../utils/applyColor";
import { getSafeElement } from "../../../utils/getSafeElement";
import { Friend, UserBody } from "#shared/HTTP";

const FRIENDLIST = new Set<Friend>(); ;

const ONLINE_STYLE = `
	rounded-2xl
	w-full
	${applyColor('online')}
`;

const OFFLINE_STYLE = `
	rounded-2xl
	w-full
	${applyColor('offline')}
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
	FRIENDLIST.clear();
	const body: UserBody = { user: currentUser.username };
	const reply = await sendPostRequestToBack("/api/friends/list", JSON.stringify(body));
	if (!isRequestSuccessfull(reply))
		return;
	const friendList: Friend[] = JSON.parse(reply.content);
	friendList.forEach(element => {
		FRIENDLIST.add(element);
	});
}

/** @todo keep same generating logic to generate button ids (events) */
async function updateFriendList(): Promise<void> {
	const elem = getSafeElement("friendlist", HTMLElement);
	elem.innerHTML = '';
	await getFriendList();

	/** @todo red or green dot for online status */
	FRIENDLIST.forEach(friend => {
		const style = friend.onlineStatus ? ONLINE_STYLE: OFFLINE_STYLE;

		elem.innerHTML += `
			<details id="${friend.username}" class="${style}">
				<summary class="${SUM_STYLE}">
					<p class="${FRIEND_STYLE}" title="${friend.username}">${friend.username}</p>
				</summary>
				<div class="${DEPLOYED_STYLE}">
					${createButtonHtml(["profile"], `btn-profile-${friend.username}`, { "class": `${BTN_STYLE}` })}
					${createButtonHtml(["invite"], `btn-invite-${friend.username}`, { "class": `${BTN_STYLE}` })}
					<hr class="${SEPARATOR_STYLE}">
					${createButtonHtml(["delete"], `btn-delete-${friend.username}`, { "class": `${BTN_DELETE_STYLE}` })}
				</div>
			</details>
		`;
	});
	friendsHandler();
}

function closeAllDetails(): void {
	FRIENDLIST.forEach(friend => {
		const elem = getSafeElement(friend.username, HTMLDetailsElement);
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

async function deleteFriend(friend: string): Promise<void> {
	const body: UserBody = { user: friend };
	await sendPostRequestToBack('/api/friends/remove', JSON.stringify(body));
	updateFriendList();
}

function friendsHandler(): void {
	FRIENDLIST.forEach(friend => {
		const allElements = getSafeElement('friendlist', HTMLElement).querySelectorAll('*[id]');

		allElements.forEach(elem => {
			switch (elem.id) {
				case `${friend.username}`:
					elem.addEventListener('click', closeAllDetails);
					break;
				case `btn-profile-${friend.username}`:
					elem.addEventListener('click', openProfile);
					break;
				case `btn-invite-${friend.username}`:
					elem.addEventListener('click', inviteFriend);
					break;
				case `btn-delete-${friend.username}`:
					elem.addEventListener('click', () => deleteFriend(friend.username));
					break;
				default:
					break;
			}
		});
	});
}

export { FRIENDLIST, updateFriendList };

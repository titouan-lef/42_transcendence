import { getSafeElement } from "../../../utils/getSafeElement";
import { createHistoryBox } from "./profile_history_box";
import { GameHistoryWithAvatar, UserBody } from "#shared/HTTP";
import { setActiveBtn } from "./profile_navbar";
import { getCurrentUserInfos, InfoList } from "../../../services/user_management/user_state";
import { isRequestSuccessfull, sendPostRequestToBack } from "../../../services/api_request";

const HISTORY_STYLE = `
flex flex-col justify-start items-center gap-4
h-full w-full px-4 py-10 pr-[190px]
scrollbar-none overflow-y-scroll overflow-hidden
[mask-image:linear-gradient(to_bottom,transparent,black_5%,black_90%,transparent)]
`;

function getHistoryTable(history: GameHistoryWithAvatar[]): string {
	return (`
	<div class="${HISTORY_STYLE}">
		${generateHistory(history, history.length)}
	</div>
	`);
}

function generateHistory(history: GameHistoryWithAvatar[], numberDisplay: number): string {
	let histBoxes = ``;
	const size = history.length;

	for(let i = 0; i < size && i < numberDisplay; i++)
		histBoxes += createHistoryBox(history[i]);
	return histBoxes;
}

async function loadHistory(): Promise<void> {
	const currentUser: InfoList | null = getCurrentUserInfos();
	if (!currentUser)
		return;

	setActiveBtn('btn-history');

	const body: UserBody = { user: currentUser.username };
	const reply = await sendPostRequestToBack('/api/user/history', JSON.stringify(body));
	if (!isRequestSuccessfull(reply))
		return;

	const data: GameHistoryWithAvatar[] = JSON.parse(reply.content);

	const elem = getSafeElement('profile-content', HTMLElement);
	elem.innerHTML = getHistoryTable(data);

}

export { loadHistory, generateHistory };

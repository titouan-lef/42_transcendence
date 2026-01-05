import { getSafeElement } from "../../../utils/getSafeElement";
import { createHistoryBox } from "./profile_history_box";
import { GameHistoryWithAvatar, UserBody } from "#shared/HTTP";
import { setActiveBtn } from "./profile_navbar";
import { getCurrentUserInfos, InfoList } from "../../../services/user_management/user_state";
import { isRequestSuccessfull, sendPostRequestToBack } from "../../../services/api_request";

let hisotryData: GameHistoryWithAvatar[];

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

async function fetchHistoryData(user: string): Promise<void> {
	const body: UserBody = { user: user };
	const reply = await sendPostRequestToBack('/api/user/history', JSON.stringify(body));
	if (!isRequestSuccessfull(reply))
		return;

	hisotryData = JSON.parse(reply.content);
}

async function getHistoryData(): Promise<GameHistoryWithAvatar[]> {
	return hisotryData;
}

function generateHistory(history: GameHistoryWithAvatar[], numberDisplay: number): string {
	let histBoxes = ``;
	const size = history.length;

	for(let i = 0; i < size && i < numberDisplay; i++)
		histBoxes += createHistoryBox(history[i]);
	return histBoxes;
}

async function loadHistory(): Promise<void> {
	setActiveBtn('btn-history');

	const elem = getSafeElement('profile-content', HTMLElement);
	elem.innerHTML = getHistoryTable(hisotryData);
}

export { loadHistory, generateHistory, fetchHistoryData, getHistoryData };

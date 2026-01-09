import { getSafeElement } from "../../../utils/getSafeElement";
import { createHistoryBox } from "./profile_history_box";
import { GameHistoryWithAvatar, UserBody } from "#shared/HTTP";
import { setActiveBtn } from "./profile_navbar";
import { isRequestSuccessfull, sendPostRequestToBack } from "../../../services/api_request";
import { navigateTo } from "../../../routes/navigate";
import { Pages } from "../../../routes/navigate_types";
import { GUEST_NAME } from "#shared/constant";

let historyData: GameHistoryWithAvatar[] = [];

/** @todo remove tests */
const TEST: GameHistoryWithAvatar = {
	isAvatarSet: false,
	date: '12/12/12',
	duration: 490,
	season: 2,
	opponentUsername: 'user',
	opponentNickname: 'niki',
	eloVariation: 45,
	myScore: 11,
	opponentScore: 5
};

/** @todo remove tests */
const TESTE: GameHistoryWithAvatar = {
	isAvatarSet: false,
	date: '12/12/12',
	duration: 490,
	season: 2,
	opponentUsername: 'user',
	opponentNickname: 'niki',
	eloVariation: 45,
	myScore: 5,
	opponentScore: 11
};

const HISTORY_STYLE = `
flex flex-col justify-start items-center gap-4
h-full w-full px-4 py-10
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

	historyData = JSON.parse(reply.content);

	/** @todo remove tests */
	historyData.push(TEST);
	/** @todo remove tests */
	historyData.push(TESTE);
}

async function getHistoryData(): Promise<GameHistoryWithAvatar[]> {
	return historyData;
}

function generateHistory(history: GameHistoryWithAvatar[], numberDisplay: number): string {
	let histBoxes = ``;
	const size = history.length;

	let i = 0;
	while (i < size && i < numberDisplay) {
		const season = history[i].season;
		let nbGameInSeason = 1;
		while (i + nbGameInSeason < size && season === history[i + nbGameInSeason].season)
			++nbGameInSeason;
		for (let j = i; j < numberDisplay && j < i + nbGameInSeason; ++j)
			histBoxes += createHistoryBox(history[j], i + nbGameInSeason - j);
		i += nbGameInSeason;
	}
	return histBoxes;
}

async function loadHistory(): Promise<void> {
	setActiveBtn('btn-history');

	const elem = getSafeElement('profile-content', HTMLElement);
	elem.innerHTML = getHistoryTable(historyData);

	historyData.forEach((game) => {
		if (game.opponentUsername === GUEST_NAME)
			return;
		const element = getSafeElement(`${game.date}-${game.opponentUsername}-nickname`, HTMLElement);
		element.addEventListener('click', () => navigateTo(Pages.PROFILE, game.opponentUsername));
	});
}

export { loadHistory, generateHistory, fetchHistoryData, getHistoryData };

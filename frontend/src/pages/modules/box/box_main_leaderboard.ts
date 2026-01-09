import { getSafeElement } from "../../../utils/getSafeElement";
import { MAIN_BOX_BTN_STYLE } from "../box/box_main_utils";
import { createButtonHtml } from "../../../components/button";
import { goBack, navigateTo } from "../../../routes/navigate";
import { Pages } from "../../../routes/navigate_types";
import { isRequestSuccessfull, sendGetRequestToBack } from "../../../services/api_request";
import { LeaderboardInfos, Ranking } from "#shared/HTTP.js";
import { getFilterHtml } from "../../../components/selectionMenu";

const TABLE_HEAD_CELL_STYLE = `
p-4 max-w-0 uppercase
`;

const LEADERBOARD_THEAD = `
<thead class="bg-light text-variant w-full">
	<tr class="w-full">
		<th class="${TABLE_HEAD_CELL_STYLE}">#</th>
		<th class="${TABLE_HEAD_CELL_STYLE}">nickname</th>
		<th class="${TABLE_HEAD_CELL_STYLE}">elo</th>
		<th class="${TABLE_HEAD_CELL_STYLE}">winrate</th>
		<th class="${TABLE_HEAD_CELL_STYLE}">games played</th>
	</tr>
</thead>
`;

const TABLE_DATA_STYLE = `
even:bg-primary/10 bg-dark/30 w-full h-[50px] text-light
`;

const TABLE_DATA_CELL_STYLE = `
p-4 max-w-0 truncate
`;

const SEASON_DATES_STYLE = `
text-[20px] mb-4
`;

const SELECT_NAME = `leaderbord-filter`;

function getLeaderboardPage(maxSeason: number ): string {
	return `
	<div class='flex flex-col justify-center items-center w-full h-full p-4 flex-1'>
		<div class='pb-2'>
			${getFilterHtml(SELECT_NAME, maxSeason)}
		</div>
		<div id="season-dates" class='${SEASON_DATES_STYLE}'>
		</div>
		<div class='w-full scrollbar-none overflow-y-auto min-h-0 rounded-t-xl'>
			<table class="w-full text-center border-collapse ">
				${LEADERBOARD_THEAD}
			</table>
		</div>
		<div class='flex-1 w-full scrollbar-none overflow-y-auto min-h-0 rounded-b-xl m-4 mt-0 bg-dark/50'>
			<table class="w-full text-center border-collapse ">
				<tbody id="leaderboard" class="rounded-xl h-full bg-dark text-primary items-center justify-start w-full">
				</tbody>
			</table>
		</div>
		${createButtonHtml(["go_back"], "btn-back-home", { "class": `${MAIN_BOX_BTN_STYLE}` })}
	</div>
	`;
}

function generateLeaderboardRows(ranking: Ranking[]): void {
	const leaderboard = getSafeElement('leaderboard', HTMLElement);
	let rank = 1;
	ranking.forEach(user => {
		leaderboard.insertAdjacentHTML('beforeend',`
			<tr class="${TABLE_DATA_STYLE}">
				<td class="${TABLE_DATA_CELL_STYLE}">${rank}</td>
				<td id="btn-profile-${user.username}" class="${TABLE_DATA_CELL_STYLE} cursor-pointer" title='${user.nickname}'>
					${user.nickname}
				</td>
				<td class="${TABLE_DATA_CELL_STYLE}">${user.rating}</td>
				<td class="${TABLE_DATA_CELL_STYLE}">${user.winrate * 100}</td>
				<td class="${TABLE_DATA_CELL_STYLE}">${user.nbGamePlayed}</td>
			</tr>
			`
		);
		const elem = getSafeElement(`btn-profile-${user.username}`, HTMLElement);
		elem.addEventListener('click', () => navigateTo(Pages.PROFILE, user.username));
		rank += 1;
	});
}

async function updateLeaderboardData(): Promise<void> {
	const filter = getSafeElement(SELECT_NAME, HTMLSelectElement);
	const targetSeason = Number(filter.value);
	const reply = await sendGetRequestToBack(`/api/season/${targetSeason}`);
	if (!isRequestSuccessfull(reply))
		return;
	const infos: LeaderboardInfos = JSON.parse(reply.content);

	generateLeaderboardRows(infos.ranking);

	const elem = getSafeElement('season-dates', HTMLElement);
	elem.innerHTML = `season date : ${infos.beginDate} to ${infos.endDate}`;
}

function leaderboardEvents(): void {
	const allElements = getSafeElement('main-box', HTMLElement).querySelectorAll('*[id]');
	allElements.forEach(elem => {
		switch (elem.id) {
			case 'btn-back-home':
				elem.addEventListener('click', goBack);
				break;
			default:
				break;
		}
	});
	const filter = getSafeElement(SELECT_NAME, HTMLSelectElement);
	filter.addEventListener('change', updateLeaderboardData);
}

async function openLeaderboard(): Promise<void> {
	const seasonReply = await sendGetRequestToBack('/api/season');
	if (!isRequestSuccessfull(seasonReply))
		return;
	const seasonNumber: number = JSON.parse(seasonReply.content);

	const elem = getSafeElement('main-box', HTMLElement);
	elem.innerHTML = getLeaderboardPage(seasonNumber);
	await updateLeaderboardData();
	leaderboardEvents();
}

function loadLeaderboard(): void {
	navigateTo(Pages.LEADERBOARD);
}

export { loadLeaderboard, openLeaderboard };

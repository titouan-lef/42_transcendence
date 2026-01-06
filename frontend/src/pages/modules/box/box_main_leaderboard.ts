import { getSafeElement } from "../../../utils/getSafeElement";
import { MAIN_BOX_BTN_STYLE } from "../box/box_main_utils";
import { createButtonHtml } from "../../../components/button";
import { goBack, navigateTo } from "../../../routes/navigate";
import { Pages } from "../../../routes/navigate_types";
import { isRequestSuccessfull, sendGetRequestToBack } from "../../../services/api_request";
import { LeaderboardInfos, Ranking } from "#shared/HTTP.js";
import { getFilterHtml } from "../../../components/selectionMenu";

const LEADERBOARD_THEAD = `
<thead class="bg-light flex text-variant w-full">
	<tr class="flex w-full my-4">
		<th class="p-4 w-1/5">#</th>
		<th class="p-4 w-1/5">nickname</th>
		<th class="p-4 w-1/5">elo</th>
		<th class="p-4 w-1/5">winrate</th>
		<th class="p-4 w-1/5">games played</th>
	</tr>
</thead>
`;

function getLeaderboardPage(maxSeason: number ): string {
	return `
	<div class='flex flex-col justify-center items-center w-full h-full p-4'>
		<div class='pb-2'>
			${getFilterHtml(maxSeason)}
		</div>
		<div id="season-dates" class=''>
		</div>
		<table class="text-left w-full h-full flex-1 min-h-0">
			${LEADERBOARD_THEAD}
			<tbody id="leaderboard" class="h-[50vh] bg-dark text-primary flex flex-col items-center justify-start scrollbar-none overflow-auto w-full">
			</tbody>
		</table>
		${createButtonHtml(["go_back"], "btn-back-home", { "class": `${MAIN_BOX_BTN_STYLE}` })}
	</div>
	`;
}

function generateLeaderboardRows(ranking: Ranking[]): string {
	let rows = ``;
	let rank = 1;
	ranking.forEach(user => { /** @todo user btn-profile-nickname to go to nickname's profile page */
		rows += `
		<tr class="flex w-full mb-1 h-[70px]">
			<td class="p-4 w-1/5">${rank}</td>
			<td id='btn-profile-${user.nickname}' class="p-4 w-1/5">${user.nickname}</td>
			<td class="p-4 w-1/5">${user.rating}</td>
			<td class="p-4 w-1/5">${user.winrate * 100}</td>
			<td class="p-4 w-1/5">${user.nbGamePlayed}</td>
		</tr>
		`;
		rank += 1;
	});

	return rows;
}

async function updateLeaderboardData(): Promise<void> {
	const filter = getSafeElement('filter', HTMLSelectElement);
	const targetSeason = Number(filter.value);
	const reply = await sendGetRequestToBack(`/api/season/${targetSeason}`);
	if (!isRequestSuccessfull(reply))
		return;
	const infos: LeaderboardInfos = JSON.parse(reply.content);

	const leaderboard = getSafeElement('leaderboard', HTMLElement);
	leaderboard.innerHTML = generateLeaderboardRows(infos.ranking);

	const elem = getSafeElement('season-dates', HTMLElement);
	elem.innerHTML = `${infos.beginDate} - ${infos.endDate}`;
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
	const filter = getSafeElement('filter', HTMLSelectElement);
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

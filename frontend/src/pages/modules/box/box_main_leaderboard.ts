import { getSafeElement } from "../../../utils/getSafeElement";
import { MAIN_BOX_BTN_STYLE } from "../box/box_main_utils";
import { LEADERBOARD_USERS } from "./box_main_leaderboards_users";
import { createButtonHtml } from "../../../components/button";
import { goBack, navigateTo } from "../../../routes/navigate";
import { Pages } from "../../../routes/navigate_types";
import { isRequestSuccessfull, sendGetRequestToBack } from "src/services/api_request";
import { LeaderboardInfos } from "#shared/HTTP.js";
import { getDashboardFilterHtml } from "../profile/profile_dashboard";
import { getCurrentUserInfos, InfoList } from "src/services/user_management/user_state";

/** @todo start filter with most recent season */

const LEADERBOARD_THEAD = `
<thead class="bg-light flex text-variant w-full">
	<tr class="flex w-full my-4">
		<th class="p-4 w-1/5">#</th>
		<th class="p-4 w-1/5">nickname</th>
		<th class="p-4 w-1/5">elo</th>
		<th class="p-4 w-1/5">winrate</th>
		<th class="p-4 w-1/5">games won</th>
	</tr>
</thead>
`;

function getLeaderboardPage(maxSeason: number ): string {

	return `
		${getDashboardFilterHtml(maxSeason)}
		<p>inserer la date de la saison ici :)</p>
		<table class="text-left w-full overflow-auto">
			${LEADERBOARD_THEAD}
			<tbody id="leaderboard" class="h-[50vh] bg-dark text-primary flex flex-col items-center justify-between overflow-y-scroll w-full">
			</tbody>
		</table>
		${createButtonHtml(["go_back"], "btn-back-home", { "class": `${MAIN_BOX_BTN_STYLE}` })}
		`;
}

function generateLeaderboardRows(ranking: LeaderboardInfos[]): string {
	let rows = ``;
	let rank = 1;
	ranking.forEach(user => { /** @todo user btn-profile-nick to go to nick's profile page */
		rows += `
		<tr class="flex w-full mb-4">
			<td class="p-4 w-1/5">${rank}</td>
			<td id='btn-profile-${user.nick}' class="p-4 w-1/5">${user.nick}</td>
			<td class="p-4 w-1/5">${user.elo}</td>
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
	let targetSeason = Number(filter.value);
	if (!targetSeason)
		targetSeason = -1;
	const reply = await sendGetRequestToBack(`/api/season/${1}`);
	if (!isRequestSuccessfull(reply))
		return;
	const ranking: LeaderboardInfos[] = JSON.parse(reply.content);

	const elem = getSafeElement('leaderboard', HTMLElement);
	elem.innerHTML = generateLeaderboardRows(ranking);
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

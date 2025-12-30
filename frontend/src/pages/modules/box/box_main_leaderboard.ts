import { getSafeElement } from "src/utils/getSafeElement";
import { loadMainBox, MAIN_BOX_BTN_STYLE } from "../box/box_main_utils";
import { LEADERBOARD_USERS } from "./box_main_leaderboards_users";
import { createButtonHtml } from "src/components/button";

/** @todo start filter with most recent season */
const LEADERBOARD_FILTER = `
<select id="filter" class="">
	<option value="s1">season3</option>
	<option value="s2">season2</option>
	<option value="s3">season1</option>
	<option value="all">all</option>
</select>
`;

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

const LEADERBOARD_TABLE = `
${LEADERBOARD_FILTER}
<p>inserer la date de la saison ici :)</p>
<table class="text-left w-full overflow-auto">
	${LEADERBOARD_THEAD}
	<tbody class="h-[50vh] bg-dark text-primary flex flex-col items-center justify-between overflow-y-scroll w-full">
		${generateLeaderboardRows()}
	</tbody>
</table>
${createButtonHtml(["go_back"], "btn-back-home", { "class": `${MAIN_BOX_BTN_STYLE}` })}
`;

/** @todo fetch all user info ? */
function generateLeaderboardRows(): string {
	let rows = ``;

	LEADERBOARD_USERS.sort(); /** @todo sort by elo */

	LEADERBOARD_USERS.forEach(user => { /** @todo user btn-profile-nick to go to nick's profile page */
		rows += `
		<tr class="flex w-full mb-4">
			<td class="p-4 w-1/5">1</td>
			<td id='btn-profile-${user.nick}' class="p-4 w-1/5">${user.nick}</td>
			<td class="p-4 w-1/5">${user.elo}</td>
			<td class="p-4 w-1/5">${user.winrate * 100}</td>
			<td class="p-4 w-1/5">${user.wins}</td>
		</tr>
		`;
	});

	return rows;
}

function leaderboardEvents(): void {
	const allElements = getSafeElement('main-box', HTMLElement).querySelectorAll('*[id]');
	allElements.forEach(elem => {
		switch (elem.id) {
			case 'btn-back-home':
				elem.addEventListener('click', () => console.log('go back home button')); /** @todo navigate to home with nav system */
				break;
			default:
				break;
		}
	});
}

function loadLeaderboard(): void {
	loadMainBox(LEADERBOARD_TABLE, leaderboardEvents);
}

export { loadLeaderboard };

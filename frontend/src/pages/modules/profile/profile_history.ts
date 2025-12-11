import { getSafeElement } from "../../../utils/getSafeElement";
import { createHistoryBox } from "./profile_history_box";
import { setActiveBtn } from "./profile_navbar";

interface GameHistory {
	date: string,
	time: number,
	opponent_avatar: string,
	opponent_name: string,
	elo: number,
	player_score: number,
	opponent_score: number,
}

/** @todo replace by fetching to back */
const HISTORYLIST: GameHistory[] = [
	{
		date: '29/06/1990',
		time: 886,
		opponent_avatar: './images/avatar.png',
		opponent_name: 'opponent1',
		elo: 42,
		player_score: 11,
		opponent_score: 0,
	},
	{
		date: '29/06/1990',
		time: 886,
		opponent_avatar: './images/avatar.png',
		opponent_name: 'opponent_too_long_name',
		elo: -18,
		player_score: 10,
		opponent_score: 11,
	},
	{
		date: '29/06/1990',
		time: 886,
		opponent_avatar: './images/avatar.png',
		opponent_name: 'opponent2',
		elo: -7,
		player_score: 5,
		opponent_score: 10,
	},
	{
		date: '29/06/1990',
		time: 886,
		opponent_avatar: './images/avatar.png',
		opponent_name: 'o',
		elo: 42,
		player_score: 11,
		opponent_score: 0,
	},
	{
		date: '29/06/1990',
		time: 886,
		opponent_avatar: './images/avatar.png',
		opponent_name: 'opponent115465465',
		elo: 42,
		player_score: 11,
		opponent_score: 0,
	},
	{
		date: '29/06/1990',
		time: 886,
		opponent_avatar: './images/avatar.png',
		opponent_name: 'opponent111233333',
		elo: 42,
		player_score: 11,
		opponent_score: 0,
	},
	{
		date: '29/06/1990',
		time: 886,
		opponent_avatar: './images/avatar.png',
		opponent_name: 'opponentdwqdwqd',
		elo: 42,
		player_score: 11,
		opponent_score: 0,
	},
	{
		date: '29/06/1990',
		time: 886,
		opponent_avatar: './images/avatar.png',
		opponent_name: 'dwqdwqdwqd',
		elo: 42,
		player_score: 11,
		opponent_score: 0,
	},
	{
		date: '29/06/1990',
		time: 886,
		opponent_avatar: './images/avatar.png',
		opponent_name: 'vcxvcxedwev',
		elo: 42,
		player_score: 11,
		opponent_score: 0,
	},
	{
		date: '29/06/1990',
		time: 886,
		opponent_avatar: './images/avatar.png',
		opponent_name: 'rtbrt26+5+',
		elo: 42,
		player_score: 11,
		opponent_score: 0,
	},
	{
		date: '29/06/1990',
		time: 886,
		opponent_avatar: './images/avatar.png',
		opponent_name: 'vdfrobert',
		elo: 42,
		player_score: 11,
		opponent_score: 0,
	},
];

const HISTORY_STYLE = `
flex flex-col justify-start items-center gap-4
h-full w-full px-4 py-10
scrollbar-none overflow-y-scroll overflow-hidden
[mask-image:linear-gradient(to_bottom,transparent,black_5%,black_90%,transparent)]
`;

const HISTORY = `
<div class="${HISTORY_STYLE}">
	${generateHistory(HISTORYLIST.length)}
</div>
`;

function generateHistory(n: number): string {
	let i = 0;
	let histBoxes = ``;

	while (i < HISTORYLIST.length && i < n) {
		histBoxes += createHistoryBox(HISTORYLIST[i]);
		i++;
	}

	return histBoxes;
}

function loadHistory(): void {
	const elem = getSafeElement('profile-content', HTMLElement);

	elem.innerHTML = HISTORY;
	setActiveBtn('btn-history');

	/** @todo events: clicking on history boxes to get more infos ? */
}

export { GameHistory, HISTORY, loadHistory, generateHistory };

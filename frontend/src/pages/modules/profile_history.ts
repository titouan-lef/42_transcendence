import { applyColor } from "../../utils/applyColor";
import { getSafeElement } from "../../utils/getSafeElement";
import { setActiveBtn } from "./profile";

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

const HISTORY_BOX_STYLE = `

`;

const AVATAR_STYLE = `
grow-0
rounded-2xl
bg-white
`;

const HISTORY = `
<div class="flex flex-col justify-start items-center gap-4 h-full w-full px-4 py-10 scrollbar-none
overflow-y-scroll overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_5%,black_90%,transparent)]">
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

function createHistoryBox(game: GameHistory): string {
	const victory = (game.player_score > game.opponent_score) ? 'win': 'lose';

	const htmlContent = `
	<div class="${applyColor(victory)}
		grow max-h-[180px] min-h-[100px]
		p-4 w-full rounded-2xl
		flex flex-row gap-4 justify-between
		font-jbm text-3xl text-variant
		bg-grad-l from-dark
		shadow-xs shadow-dark
	">
		<div class="flex flex-row justify-center items-center gap-4">
			<div id="print-avatar" class="${AVATAR_STYLE}">
				<img src="${game.opponent_avatar}" alt="Avatar" width="50px" height="50px">
			</div>
			<div class="flex flex-col justify-center items-start gap-1 max-w-[350px]">
				<div id="print-nickname" class="font-park truncate w-full text-ellipsis">
					${game.opponent_name}
				</div>
				<div id="print-date" class="text-[15px]">
					${game.date} - ${~~(game.time / 60)} min ${(game.time % 60)} sec
				</div>
			</div>
		</div>
		<div class="flex flex-row justify-center items-center gap-4">
			<div id="print-score" class="w-[135px] text-center font-bold">
				${game.player_score} - ${game.opponent_score}
			</div>
			<div id="print-elo" class="text-[18px] w-[115px] h-[30px] rounded-2xl flex items-center justify-center shadow-[0_0_10px_0] ${victory === 'win' ? 'bg-win/50 shadow-win/50' : 'bg-lose/50 shadow-lose/50'}">
				${game.elo > 0 ? '+' + game.elo.toString() : game.elo.toString()}
			</div>
		</div>
	</div>
	`;

	return htmlContent;
}

function loadHistory(): void {
	const elem = getSafeElement('profile-content', HTMLElement);

	elem.innerHTML = HISTORY;
	setActiveBtn('btn-history');

	/** @todo events: clicking on history boxes to get more infos ? */
}

export { HISTORY, loadHistory, generateHistory };

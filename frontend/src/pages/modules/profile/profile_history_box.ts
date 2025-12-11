import { applyColor } from "../../../utils/applyColor";
import { GameHistory } from "./profile_history";

/** @todo min-h-[xxx] a modifier pcq c'est moche */
const HISTORY_BOX_STYLE = `
grow max-h-[180px] min-h-[50px]
p-4 w-full rounded-2xl
flex flex-row gap-4 justify-between
font-jbm text-3xl text-variant
bg-grad-l from-dark
shadow-xs shadow-dark
`;

const HISTORY_TEXT_BOX_STYLE = `
flex flex-row justify-center items-center gap-4
`;

const HISTORY_GAME_INFO_STYLE = `
flex flex-col justify-center items-start gap-1 max-w-[350px]
`;

const HISTORY_ELO_BOX_STYLE = `
text-[18px] w-[115px] h-[30px] rounded-2xl
flex items-center justify-center
shadow-[0_0_10px_0]
`;

const HISTORY_SCORE_STYLE = `
w-[135px] text-center font-bold
`;

const AVATAR_STYLE = `
grow-0
rounded-2xl
bg-white
overflow-hidden
`;

function createHistoryBox(game: GameHistory): string {
	const victory = (game.player_score > game.opponent_score) ? 'win': 'lose';

	const htmlContent = `
	<div class="${applyColor(victory)} ${HISTORY_BOX_STYLE}">
		<div class="${HISTORY_TEXT_BOX_STYLE}">
			<div id="print-avatar" class="${AVATAR_STYLE}">
				<img src="${game.opponent_avatar}" alt="Avatar" width="50px" height="50px">
			</div>
			<div class="${HISTORY_GAME_INFO_STYLE}">
				<div id="print-nickname" class="font-park truncate w-full text-ellipsis">
					${game.opponent_name}
				</div>
				<div id="print-date" class="text-[15px]">
					${game.date} - ${~~(game.time / 60)} min ${(game.time % 60)} sec
				</div>
			</div>
		</div>
		<div class="${HISTORY_TEXT_BOX_STYLE}">
			<div id="print-score" class="${HISTORY_SCORE_STYLE}">
				${game.player_score} - ${game.opponent_score}
			</div>
			<div id="print-elo" class="${HISTORY_ELO_BOX_STYLE}
			${victory === 'win' ? 'bg-win/50 shadow-win/50' : 'bg-lose/50 shadow-lose/50'}">
				${game.elo > 0 ? '+' + game.elo.toString() : game.elo.toString()}
			</div>
		</div>
	</div>
	`;

	return htmlContent;
}

export { createHistoryBox };

import { applyColor } from "../../../utils/applyColor";
import { GameHistoryWithAvatar } from "#shared/HTTP";

const HISTORY_BOX_STYLE = `
flex-1 min-h-[80px] max-h-[120px]
p-4 w-full rounded-2xl
flex flex-row gap-4 justify-between
font-jbm text-3xl text-variant
bg-grad-l from-dark
shadow-xs shadow-dark
`;

const HISTORY_TEXT_BOX_STYLE = `
flex flex-row items-center gap-4 w-full flex-1 min-w-0
`;

const HISTORY_GAME_INFO_STYLE = `
flex flex-col justify-center items-start gap-1 max-w-1/2
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
shrink-0
`;

function createHistoryBox(game: GameHistoryWithAvatar): string {
	const victory = (game.myScore > game.opponentScore) ? 'win': 'lose';
	let avatar: string;
	if (!game.isAvatarSet)
		avatar = "./images/avatar.png";
	else
		avatar = `/pictures/${game.opponentUsername}?t=${Date.now()}`;
	const htmlContent = `
	<div class="${applyColor(victory)} ${HISTORY_BOX_STYLE}">
		<div class="${HISTORY_TEXT_BOX_STYLE} justify-start">
			<div id="print-avatar" class="${AVATAR_STYLE}">
				<img src="${avatar}" alt="Avatar" width="50px" height="50px">
			</div>
			<div class="${HISTORY_GAME_INFO_STYLE}">
				<div id="${game.opponentUsername}-nickname" class="font-park truncate w-full text-ellipsis">
					${game.opponentNickname}
				</div>
				<div id="print-date" class="text-[15px] truncate">
					Season ${game.season} - ${game.date} - duration : ${~~(game.duration / 60)} min ${(game.duration % 60)} sec
				</div>
			</div>
		</div>
		<div class="${HISTORY_TEXT_BOX_STYLE} justify-end">
			<div id="print-score" class="${HISTORY_SCORE_STYLE}">
				${game.myScore} - ${game.opponentScore}
			</div>
			<div id="print-elo" class="${HISTORY_ELO_BOX_STYLE}
			${victory === 'win' ? 'bg-win/50 shadow-win/50' : 'bg-lose/50 shadow-lose/50'}">
				${game.eloVariation > 0 ? '+' + game.eloVariation.toString() : game.eloVariation.toString()}
			</div>
		</div>
	</div>
	`;

	return htmlContent;
}

export { createHistoryBox };

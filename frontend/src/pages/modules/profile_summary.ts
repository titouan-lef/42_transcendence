import { createButtonHtml } from "../../components/button";
import { createParagraphHtml } from "../../components/paragraph";
import { applyColor } from "../../utils/applyColor";
import { getSafeElement } from "../../utils/getSafeElement";
import { setActiveBtn } from "./profile";

const SEE_MORE_BTN = `
rounded-r-2xl
w-full h-[30px] bg-grad-t-15 text-[20px] text-variant
`;

const SECTION_STYLE = `
min-w-0
px-6 pt-6
flex flex-col justify-start items-centers
`;

const SECTION_TITLE_STYLE = `
text-[26px] font-bold text-center
`;

const SUMMARY_DASHBOARD_STYLE = `
flex-1
bg-dark shadow-md shadow-dark
rounded-2xl p-4
flex flex-col justify-start items-start
`;

/** @todo move to profile_history.ts */
const HISTORY_BOX_STYLE = `
flex-1
p-4 w-full rounded-2xl h-[100px]
bg-grad-l
flex flex-row gap-4 justify-between
font-jbm text-3xl text-variant
`;

const AVATAR_STYLE = `
grow-0
rounded-2xl
bg-white
`;

/** @todo fetch elo, calculate max of wins for balls and maps */
const SUMMARY = `
<div class="flex flex-col gap-1 h-full">
	<div id='sum-dashboard' class="${SECTION_STYLE}">
		${createParagraphHtml(['dashboard'], 'p-dashboard', { 'class': `${SECTION_TITLE_STYLE}` })}
		<div class="p-4 flex h-[150px] w-full gap-4">
			<div class="${SUMMARY_DASHBOARD_STYLE}">
				${createParagraphHtml(['elo'], 'p-elo', { 'class': 'text-[20px] text-secondary' })}
				<div class="w-full h-full items-center text-[48px] text-center">
					500
				</div>
			</div>
			<div class="${SUMMARY_DASHBOARD_STYLE}">
				${createParagraphHtml(['prefered_map'], 'p-map', { 'class': 'text-[20px] text-secondary' })}
				<div class="w-full h-full items-center text-[48px] text-center">
					volcano
				</div>
			</div>
			<div class="${SUMMARY_DASHBOARD_STYLE}">
				${createParagraphHtml(['prefered_ball'], 'p-ball', { 'class': 'text-[20px] text-secondary' })}
				<div class="w-full h-full items-center text-[48px] text-center">
					snake
				</div>
			</div>
		</div>
	</div>
	${createButtonHtml(['see_more'], 'btn-sum-dashboard', { 'class':`${SEE_MORE_BTN}` })}
	<div id='sum-history' class="${SECTION_STYLE} h-full">
		${createParagraphHtml(['last_games'], 'p-last-games', { 'class': `${SECTION_TITLE_STYLE}` })}
		<div class="flex flex-col justify-start items-center gap-4 h-full w-full p-4">
			<div class="${HISTORY_BOX_STYLE} ${applyColor('win')}">
				<div class="flex flex-row justify-center items-center gap-4">
					<div class="${AVATAR_STYLE}">
						<img src="./images/avatar.png" alt="Avatar" width="50px" height="50px">
					</div>
					<div class="font-park max-w-[350px] truncate text-ellipsis">
						Opponent's nickname
					</div>
				</div>
				<div class="flex flex-row justify-center items-center gap-4">
					<div id="print-score" class="w-[135px] text-center font-bold">11 - 00</div>
					<div id="print-elo" class="text-[18px] w-[115px] h-[30px] rounded-2xl flex items-center justify-center bg-win/50 shadow-[0_0_10px_0] shadow-win/50">
						+42 elo
					</div>
				</div>
			</div>
			<div class="${HISTORY_BOX_STYLE} ${applyColor('lose')}">
				<div class="flex flex-row justify-center items-center gap-4">
					<div class="${AVATAR_STYLE}">
						<img src="./images/avatar.png" alt="Avatar" width="50px" height="50px">
					</div>
					<div class="font-park max-w-[350px] truncate text-ellipsis">
						Opponent's nickname that's waaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaay too long
					</div>
				</div>
				<div class="flex flex-row justify-center items-center gap-4">
					<div id="print-score" class="w-[135px] text-center font-bold">01 - 10</div>
					<div id="print-elo" class="text-[18px] w-[115px] h-[30px] rounded-2xl flex items-center justify-center bg-lose/50 shadow-[0_0_10px_0] shadow-lose/50">
						-18 elo
					</div>
				</div>
			</div>
			<div class="${HISTORY_BOX_STYLE} ${applyColor('lose')}">
				<div class="flex flex-row justify-center items-center gap-4">
					<div class="${AVATAR_STYLE}">
						<img src="./images/avatar.png" alt="Avatar" width="50px" height="50px">
					</div>
					<div class="font-park max-w-[350px] truncate text-ellipsis">
						ON
					</div>
				</div>
				<div class="flex flex-row justify-center items-center gap-4">
					<div id="print-score" class="w-[135px] text-center font-bold">11 - 10</div>
					<div id="print-elo" class="text-[18px] w-[115px] h-[30px] rounded-2xl flex items-center justify-center bg-lose/50 shadow-[0_0_10px_0] shadow-lose/50">
						-42 elo
					</div>
				</div>
			</div>
		</div>
	</div>
	${createButtonHtml(['see_more'], 'btn-sum-history', { 'class':`${SEE_MORE_BTN}` })}
</div>
`;

function loadSummary(): void {
	const content = getSafeElement('profile-content', HTMLElement);

	content.innerHTML = SUMMARY;
	setActiveBtn('btn-summary');

	/** @todo events */
}

export { SUMMARY, loadSummary };

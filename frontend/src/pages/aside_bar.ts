import { createButtonHtml } from "../components/button";
import { applyColor } from "../utils/applyColor";

const ASIDE_BOX_STYLE = `
grow
flex flex-col items-center gap-[10px] justify-stretch
first:mt-[25px] last:mb-[25px]
`;

const ASIDE_STYLE = `
grow-0
flex
rounded-2xl
w-[200px]
${applyColor('alt')}
`;

const AVATAR_STYLE = `
grow-0
rounded-2xl
bg-white
`;

const FRIENDLIST_STYLE = `
grow
flex flex-col gap-[10px] justify-start items-center
rounded-2xl p-[10px]
w-[150px]
scrollbar-none
overflow-y-scroll overflow-hidden
bg-light
`;

const ASIDE_BTN_STYLE = `
rounded-[10px]
w-[150px] h-[40px]
text-[20px] font-park font-bold
${applyColor()}
`;

const ASIDE_CONNECTED = `
	${createButtonHtml(["profile"], `btn-profile`, { "class": `${ASIDE_BTN_STYLE}` })}
	<div id="friendlist" class="${FRIENDLIST_STYLE}"></div>
	${createButtonHtml(["add_friend"], `add-friend`, { "class": `${ASIDE_BTN_STYLE}` })}
	${createButtonHtml(["log_out"], `btn-log-out`, { "class": `${ASIDE_BTN_STYLE} ${applyColor('var')}` })}
`;

const ASIDE_NOT_CONNECTED = `
	${createButtonHtml(["sign_in"], `btn-sign-in`, { "class": `${ASIDE_BTN_STYLE}` })}
	${createButtonHtml(["sign_up"], `btn-sign-up`, { "class": `${ASIDE_BTN_STYLE}` })}
`;

const ASIDE_BAR = `
<aside id="aside" class="${ASIDE_STYLE}">
	<div class="${ASIDE_BOX_STYLE}">
		<div class="${AVATAR_STYLE}">
			<img src="./images/avatar.png" alt="Avatar" width="150px" height="150px">
		</div>
		<div id="aside-status">
			${ASIDE_NOT_CONNECTED}
		</div>
	</div>
</aside>
`;

export { ASIDE_BAR, ASIDE_CONNECTED, ASIDE_NOT_CONNECTED };

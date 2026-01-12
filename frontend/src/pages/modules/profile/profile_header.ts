import { createButtonHtml } from "../../../components/button";
import { isRequestSuccessfull, sendPostRequestToBack } from "../../../services/api_request";
import { MAIN_BOX_BTN_STYLE } from "../box/box_main_utils";
import { isFriendWith } from "../box/box_aside_friendlist";

const TITLE_STYLE = `
font-bold text-[48px]
`;

const DRAWER_HEADER_STYLE = `
w-full flex flex-row justify-stretch pl-4 pr-[190px]
`;

const RETURN_BTN_DIV_STYLE = `
flex items-center justify-center
`;

const RETURN_BTN_SVG = `
<svg id='btn-return'
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		fill="none" stroke="currentColor"
		class="size-[50px] stroke-2 text-warning">
	<path
		stroke-linecap="round"
		stroke-linejoin="round"
		d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
</svg>
`;

interface UserBody { /** @todo take the one in shared */
	user?: string;
}

/** @todo use translation tool */
/** @todo nickname ne se met pas a jour quand je le change dans settings, il faut reload la page */
async function getDrawerHeader(ownProfile: boolean, user: string): Promise<string> {
	const body: UserBody = { user: user };
	const reply = await sendPostRequestToBack("/api/user/get_nick", JSON.stringify(body));
	let nickname = "";
	if (isRequestSuccessfull(reply))
		nickname = reply.content;

	return `
	<div class='${DRAWER_HEADER_STYLE}'>
		<div class='flex flex-col flex-1 min-w-0 truncate shrink-0'>
			<p title='${ownProfile ? "" : user + "'s"}' class='${TITLE_STYLE}'>
				${ownProfile ? "Your" : user + "'s"} profile
				<span id="btn-add-friend-profile-wrapper">
					${!ownProfile && !isFriendWith(user) ? createButtonHtml(["add_friend"], `btn-add-friend-profile`, { "class": `${MAIN_BOX_BTN_STYLE}` }): ""}
				</span>
			</p>
			<p title='${nickname}' class='text-[12px]'>nickname : ${nickname}</p>
		</div>
		<div class='${RETURN_BTN_DIV_STYLE}'>
			${RETURN_BTN_SVG}
		</div>
	</div>
	`;
}

export { getDrawerHeader };

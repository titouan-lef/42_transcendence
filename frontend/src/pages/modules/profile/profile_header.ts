import { capitalizeElementValueHTML } from "../../../components/component_utils";
import { createParagraph } from "../../../components/paragraph";
import { isRequestSuccessfull, sendPostRequestToBack } from "src/services/api_request";

const TITLE_STYLE = `
grow font-bold text-[48px]
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
/** @todo pretty front */
async function getDrawerHeader(ownProfile: boolean, user: string): Promise<string> {
	const body: UserBody = { user: user };
	const reply = await sendPostRequestToBack("/api/user/get_nick", JSON.stringify(body));
	let nickname = "";
	if (isRequestSuccessfull(reply))
		nickname = reply.content;

	return `
	<div class='${DRAWER_HEADER_STYLE}'>
		${ownProfile? "Your": user+"'s"}
		${capitalizeElementValueHTML(createParagraph(['profile'], 'p-profile', { 'class' : `${TITLE_STYLE}` }))}
		${nickname}
		<div class='${RETURN_BTN_DIV_STYLE}'>
			${RETURN_BTN_SVG}
		</div>
	</div>
	`;
}


export { getDrawerHeader };

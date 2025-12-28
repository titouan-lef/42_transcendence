import { applyColor } from "../../../utils/applyColor";
import { getSafeElement } from "../../../utils/getSafeElement";
import { loadDashboard } from "./profile_dashboard";
import { loadSettings } from "./profile_settings";
import { loadHistory } from "./profile_history";
import { loadSummary } from "./profile_summary";
import { DRAWER_HEADER } from "./profile_header";
import { DRAWER_NAV } from "./profile_navbar";
import { navigateTo } from "src/routes/navigate";
import { Modals } from "src/routes/navigate_types";

const DRAWER_MAIN_STYLE = `
fixed z-10 inset-y-0 inset-x-0
m-[25px] rounded-l-2xl
shadow-[0_0_25px_0] shadow-shadow
flex justify-center items-center
`;

const DRAWER_BACKDROP_STYLE = `
h-screen w-screen
bg-white/25 backdrop-blur-sm bg-transparent
`;

const DRAWER_BOX_STYLE = `
flex flex-col
m-auto p-6 rounded-l-2xl
h-full w-full
${applyColor('alt')}
bg-grad-l-215 from-dark
flex-1 min-h-0
`;

const DRAWER_BODY_STYLE = `
flex-1 min-h-0
h-full w-full py-[25px] pl-10 pr-[190px]
flex flex-row justify-start items-center
`;

const DRAWER_CONTENT = `
<div class='${DRAWER_MAIN_STYLE}'>
	<div class='${DRAWER_BOX_STYLE}'>
		${DRAWER_HEADER}
		<div class='${DRAWER_BODY_STYLE}'>
			${DRAWER_NAV}
			<div id='profile-content' class='h-full w-full'>
			</div>
		</div>
	</div>
</div>
`;

function openProfile(): void {
	const drawer = getSafeElement("modal", HTMLDialogElement);

	drawer.className = DRAWER_BACKDROP_STYLE;
	drawer.show();
	drawer.innerHTML = DRAWER_CONTENT;

	loadSummary();
	initProfileEvents();
}

function initProfileEvents(): void {
	const drawer = getSafeElement("modal", HTMLDialogElement);

	drawer.querySelectorAll('*[id]').forEach(elem => {
		switch (elem.id) {
			case 'btn-return':
				elem.addEventListener('click', () => drawer.close());
				break;
			case 'btn-summary':
				elem.addEventListener('click', loadSummary);
				break;
			case 'btn-history':
				elem.addEventListener('click', loadHistory);
				break;
			case 'btn-dashboard':
				elem.addEventListener('click', loadDashboard);
				break;
			case 'btn-settings':
				elem.addEventListener('click', loadSettings);
				break;
			default:
				break;
		}
	});
}

function loadProfilePage(): void {
	navigateTo(Modals.PROFILE);
}

export { loadProfilePage, openProfile };

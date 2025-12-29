import { applyColor } from "../../../utils/applyColor";
import { getSafeElement } from "../../../utils/getSafeElement";
import { loadDashboard } from "./profile_dashboard";
import { loadSettings } from "./profile_settings";
import { loadHistory } from "./profile_history";
import { loadSummary } from "./profile_summary";
import { DRAWER_HEADER } from "./profile_header";
import { DRAWER_NAV } from "./profile_navbar";
import { goBack, navigateTo } from "src/routes/navigate";
import { Pages } from "src/routes/navigate_types";
import { getCurrentUserInfos } from "src/services/user_management/user_state";

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

enum ProfiteTab {
	SUMMARY,
	HISTORY,
	DASHBOARD,
	SETTINGS
}

let currentTab: ProfiteTab = ProfiteTab.SUMMARY;

function loadTab(): void {
	switch (currentTab) {
		case (ProfiteTab.SUMMARY):
			loadSummary();
			break;
		case (ProfiteTab.HISTORY):
			loadHistory();
			break;
		case (ProfiteTab.DASHBOARD):
			loadDashboard();
			break;
		case (ProfiteTab.SETTINGS):
			loadSettings();
			break;
		default:
			throw new Error("No such profile tab");
	}
}

function openProfile(): void {
	if (!getCurrentUserInfos())
		return;
	const drawer = getSafeElement("modal", HTMLDialogElement);

	drawer.className = DRAWER_BACKDROP_STYLE;
	drawer.show();
	drawer.innerHTML = DRAWER_CONTENT;

	loadTab();
	initProfileEvents();
}

function changeTab(tab: ProfiteTab): void {
	currentTab = tab;
	loadTab();
}

function initProfileEvents(): void {
	const drawer = getSafeElement("modal", HTMLDialogElement);

	drawer.querySelectorAll('*[id]').forEach(elem => {
		switch (elem.id) {
			case 'btn-return':
				elem.addEventListener('click', goBack);
				break;
			case 'btn-summary':
				elem.addEventListener('click', () => changeTab(ProfiteTab.SUMMARY));
				break;
			case 'btn-history':
				elem.addEventListener('click', () => changeTab(ProfiteTab.HISTORY));
				break;
			case 'btn-dashboard':
				elem.addEventListener('click', () => changeTab(ProfiteTab.DASHBOARD));
				break;
			case 'btn-settings':
				elem.addEventListener('click', () => changeTab(ProfiteTab.SETTINGS));
				break;
			default:
				break;
		}
	});
}

function loadProfilePage(): void {
	navigateTo(Pages.PROFILE);
}

export { loadProfilePage, openProfile };

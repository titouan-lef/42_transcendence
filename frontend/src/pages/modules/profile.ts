import { createButtonHtml } from "../../components/button";
import { capitalizeElementValueHTML } from "../../components/component_utils";
import { createParagraph } from "../../components/paragraph";
import { applyColor } from "../../utils/applyColor";
import { getSafeElement } from "../../utils/getSafeElement";
import { loadDashboard } from "./profile_dashboard";
import { loadSettings } from "./profile_settings";
import { loadHistory } from "./profile_history";
import { loadSummary, SUMMARY } from "./profile_summary";

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

const DRAWER_HEADER_STYLE = `
w-full flex flex-row justify-stretch pl-4 pr-[190px]
`;

const TITLE_STYLE = `
grow font-bold text-[48px]
`;

const RETURN_BTN_DIV_STYLE = `
flex items-center justify-center
`;

const RETURN_BTN_STYLE = `
size-[50px] stroke-2 text-warning
`;

const DRAWER_BODY_STYLE = `
flex-1 min-h-0
h-full w-full py-[25px] pl-10 pr-[190px]
flex flex-row justify-start items-center
`;

const DRAWER_CONTENT_STYLE = `
h-full w-full
`;

const DRAWER_NAV_STYLE = `
	h-full py-10
	flex flex-col gap-4 justify-start
	border-r-2 border-darker
`;

const NAV_BTN_STYLE = `
	p-2 rounded-l-[10px]
	w-[200px] h-[50px] bg-darker text-variant
	data-[active=true]:bg-variant
	data-[active=true]:text-dark
`;

function openProfile(): void {
	const drawer = getSafeElement("modal", HTMLDialogElement);

	drawer.className = DRAWER_BACKDROP_STYLE;
	drawer.show();
	drawer.innerHTML = `
		<div class='${DRAWER_MAIN_STYLE}'>
			<div class='${DRAWER_BOX_STYLE}'>
				<div class='${DRAWER_HEADER_STYLE}'>
					${capitalizeElementValueHTML(createParagraph(['profile'], 'p-profile', { 'class' : `${TITLE_STYLE}` }))}
					<div class='${RETURN_BTN_DIV_STYLE}'>
						<svg id='btn-return'
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
								fill="none" stroke="currentColor"
								class="${RETURN_BTN_STYLE}">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
						</svg>
					</div>
				</div>
				<div class='${DRAWER_BODY_STYLE}'>
					<nav class='${DRAWER_NAV_STYLE}'>
						${createButtonHtml(['summary'], 'btn-summary', { 'class': `${NAV_BTN_STYLE}`, 'data-active': 'true' })}
						${createButtonHtml(['history'], 'btn-history', { 'class': `${NAV_BTN_STYLE}` })}
						${createButtonHtml(['dashboard'], 'btn-dashboard', { 'class': `${NAV_BTN_STYLE}` })}
						${createButtonHtml(['settings'], 'btn-settings', { 'class': `${NAV_BTN_STYLE}` })}
					</nav>
					<div id='profile-content' class='${DRAWER_CONTENT_STYLE}'>
					</div>
				</div>
			</div>
		</div>
	`;

	loadSummary();

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

function setActiveBtn(id: string): void {
	document.querySelectorAll('*[id]').forEach(elem => {
		if (elem.id === id) {
			elem.setAttribute('data-active', 'true');
		} else {
			elem.removeAttribute('data-active');
		}
	});
}

export { openProfile, setActiveBtn };

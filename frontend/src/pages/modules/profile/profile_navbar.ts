import { isUserConnected } from "src/services/user_management/user_state";
import { createButtonHtml } from "../../../components/button";

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

function getDrawerNav(withSettings: boolean): string {
	if (withSettings) {
		return `
		<nav class='${DRAWER_NAV_STYLE}'>
			${createButtonHtml(['summary'], 'btn-summary', { 'class': `${NAV_BTN_STYLE}`, 'data-active': 'true' })}
			${createButtonHtml(['history'], 'btn-history', { 'class': `${NAV_BTN_STYLE}` })}
			${createButtonHtml(['dashboard'], 'btn-dashboard', { 'class': `${NAV_BTN_STYLE}` })}
			${createButtonHtml(['settings'], 'btn-settings', { 'class': `${NAV_BTN_STYLE}` })}
		</nav>
		`;
	}
	return `
	<nav class='${DRAWER_NAV_STYLE}'>
		${createButtonHtml(['summary'], 'btn-summary', { 'class': `${NAV_BTN_STYLE}`, 'data-active': 'true' })}
		${createButtonHtml(['history'], 'btn-history', { 'class': `${NAV_BTN_STYLE}` })}
		${createButtonHtml(['dashboard'], 'btn-dashboard', { 'class': `${NAV_BTN_STYLE}` })}
	</nav>
	`;
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

export { getDrawerNav, setActiveBtn };

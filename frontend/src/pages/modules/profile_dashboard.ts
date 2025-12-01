import { getSafeElement } from "../../utils/getSafeElement";
import { setActiveBtn } from "./profile";

const DASHBOARD = `
dashboard
`;

function loadDashboard(): void {
	const elem = getSafeElement('profile-content', HTMLElement);

	elem.innerHTML = DASHBOARD;
	setActiveBtn('btn-dashboard');

	/** @todo events */
}

export { DASHBOARD, loadDashboard };

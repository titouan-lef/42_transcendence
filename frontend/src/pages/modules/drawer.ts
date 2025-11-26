import { applyColor } from "../../utils/applyColor";
import { getSafeElement } from "../../utils/getSafeElement";

const DRAWER_MAIN_STYLE = `
	fixed z-10 inset-y-0 inset-x-0
	m-[25px] rounded-l-2xl
	shadow-[0_0_25px_0] shadow-shadow
`;

const DRAWER_BACKDROP_STYLE = `
	h-screen w-screen
	bg-white/25 backdrop-blur-sm bg-transparent
	flex justify-center items-center
`;

const DRAWER_BOX_STYLE = `
	flex justify-center
	m-auto p-6 rounded-l-2xl
	h-full w-full
	${applyColor('alt')}
	bg-grad-l-225 from-dark
`;

const DRAWER_INNER_STYLE = `
	flex flex-col justify-center items-center gap-4
	min-w-[100px] max-w-[250px]
`;

function loadDrawer(content: string, handler: (drawer: HTMLDialogElement) => void): void {
	const drawer = getSafeElement("modal", HTMLDialogElement);

	drawer.className = DRAWER_MAIN_STYLE;
	drawer.show();
	drawer.innerHTML = `
		<div class='${DRAWER_BOX_STYLE}'>
			<div class='${DRAWER_INNER_STYLE}'>
				${content}
			</div>
		</div>
	`;

	handler(drawer);
}

function loadDrawertest(content: string): void {
	const drawer = getSafeElement("modal", HTMLDialogElement);

	drawer.className = DRAWER_BACKDROP_STYLE;
	drawer.show();
	drawer.innerHTML = `
		<div class='${DRAWER_MAIN_STYLE}'>
			<div class='${DRAWER_BOX_STYLE}'>
				<div class='${DRAWER_INNER_STYLE}'>
					${content}
				</div>
			</div>
		</div>
	`;
}

function exitDrawer(drawer: HTMLDialogElement, event: Event): void {
	if (event.target === drawer) {
		drawer.close();
	}
}

export { loadDrawer, loadDrawertest, exitDrawer };

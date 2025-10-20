import { setTheme, Themes } from "../../themes/theme.js";

const THEME_EVENTS = new Map<string, () => void>();

Object.values(Themes).forEach(element => {
	THEME_EVENTS.set("btn-" + element, (): void => setTheme(element));
});

export function handleTheme(): void {
	document.addEventListener("click", (event) => {
		const target = event.target;

		if (target instanceof HTMLElement) {
			THEME_EVENTS.get(target.id)?.();
		} else {
			console.log("problem with HTMLElement");
		}
	});
}

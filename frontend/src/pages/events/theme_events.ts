import { setTheme, Themes } from "../../themes/theme.js";
import { addHandler } from "../events.js";

const THEME_EVENTS = new Map<string, () => void>();

Object.values(Themes).forEach(element => {
	THEME_EVENTS.set("btn-" + element, (): void => setTheme(element));
});

export function themeEvents(): void {
	THEME_EVENTS.forEach((func, key) => {
		addHandler(key, "click", func);
	});
}

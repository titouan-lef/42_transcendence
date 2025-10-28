import { setTheme, Themes } from "../../assets/themes/theme.js";
import { addHandler } from "../../routes/event.js";

const THEME_EVENTS = new Map<string, () => void>();

Object.values(Themes).forEach(theme => {
	THEME_EVENTS.set("btn-" + theme, (): void => setTheme(theme));
});

function themeEvents(): void {
	THEME_EVENTS.forEach((func, key) => {
		addHandler(key, "click", func);
	});
}

export { themeEvents };

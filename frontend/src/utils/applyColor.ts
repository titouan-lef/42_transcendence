import { getCSSVariable } from "./getCSSVariable";

type Color = 'base' | 'alt' | 'var' | 'warning' | 'input' | 'win' | 'lose' | 'online' | 'offline';

interface ThemeColors {
	primary: string,
	light: string,
	lighter: string,
	dark: string,
	darker: string,
	variant: string,
	secondary: string,
	warning: string,
	shadow: string,
	win: string,
	lose: string,
	online: string,
	offline: string,
};

const VARIANTS = {
	'base': 'bg-secondary text-primary',
	'alt': 'bg-primary text-secondary',
	'var': 'bg-variant text-warning',
	'warning': 'bg-primary text-warning',
	'input' : 'bg-lighter text-dark focus:outline-2 focus:text-dark',
	'win' : 'bg-win/40 text-win font-bold',
	'lose' : 'bg-lose text-light',
	'online' : 'bg-online text-primary font-bold',
	'offline' : 'bg-offline/40 text-offline',
};

function applyColor(variant: Color = 'base'): string {
	return `${VARIANTS[variant]}`;
};

function loadThemeColors(): ThemeColors {
	const themeColors: ThemeColors = {
		primary: getCSSVariable('--color-primary'),
		light: getCSSVariable('--color-light'),
		lighter: getCSSVariable('--color-lighter'),
		dark: getCSSVariable('--color-dark'),
		darker: getCSSVariable('--color-darker'),
		variant: getCSSVariable('--color-variant'),
		secondary: getCSSVariable('--color-secondary'),
		warning: getCSSVariable('--color-warning'),
		shadow: getCSSVariable('--color-shadow'),
		win: getCSSVariable('--color-win'),
		lose: getCSSVariable('--color-lose'),
		online: getCSSVariable('--color-online'),
		offline: getCSSVariable('--color-offline'),
	};

	return themeColors;
}

export { Color, loadThemeColors, applyColor };

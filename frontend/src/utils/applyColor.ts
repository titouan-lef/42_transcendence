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
	txprim: string,
	txsec: string,
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
	'var': 'bg-variant text-secondary',
	'warning': 'bg-primary text-warning',
	'input' : 'bg-lighter text-variant focus:outline-2 focus:text-dark',
	'win' : 'bg-win text-light',
	'lose' : 'bg-lose text-light',
	'online' : 'bg-online',
	'offline' : 'bg-offline',
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
		txprim: getCSSVariable('--color-tx-prim'),
		txsec: getCSSVariable('--color-tx-sec'),
		warning: getCSSVariable('--color-warning'),
		shadow: getCSSVariable('--color-shadow'),
		win: getCSSVariable('--color-win'),
		lose: getCSSVariable('--color-lose'),
		online: getCSSVariable('--color-online'),
		offline: getCSSVariable('--color-offline'),
	};

	return themeColors;
}

export { loadThemeColors, applyColor };

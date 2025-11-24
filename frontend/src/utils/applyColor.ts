type Color = 'base' | 'alt' | 'var' | 'warning' | 'input';

const VARIANTS = {
	'base': 'bg-secondary text-primary',
	'alt': 'bg-primary text-secondary',
	'var': 'bg-variant text-secondary',
	'warning': 'bg-primary text-warning',
	'input' : 'bg-lighter text-variant focus:outline-2 focus:text-dark',
};

function applyColor(variant: Color = 'base'): string {
	return `${VARIANTS[variant]}`;
};

export { applyColor };

type Color = 'base' | 'alt' | 'var' | 'warning' | 'input';

const VARIANTS = {
	'base': 'bg-secondary text-primary focus:outline-2',
	'alt': 'bg-primary text-secondary focus:outline-2',
	'var': 'bg-variant text-secondary focus:outline-2',
	'warning': 'bg-primary text-warning focus:outline-2',
	'input' : 'bg-lighter text-variant focus:outline-2 focus:text-dark',
};

function applyColor(variant: Color = 'base'): string {
	return `${VARIANTS[variant]}`;
};

export { applyColor };

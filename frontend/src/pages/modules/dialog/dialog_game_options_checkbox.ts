const SVG_SELECTED_STYLE = `
hidden peer-checked:flex
absolute -top-2 -right-2 z-10
w-6 h-6 rounded-full
bg-[var(--color-variant)] text-dark
items-center justify-center shadow-md
`;

const SVG_SELECTED = `
<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
	<path stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M5 13l4 4L19 7"></path>
</svg>
`;

const SVG_BOX_STYLE = `
w-full h-full rounded-2xl
bg-dark border-2 border-gray-600 text-gray-400
flex items-center justify-center
group-hover:border-gray-400
peer-checked:border-variant
peer-checked:text-variant
peer-checked:bg-variant/10
peer-checked:shadow-lg peer-checked:shadow-variant/20
`;

function createCheckbox(id: string, svg: string, value?: string): string {
	return `
	<label class="relative group w-[50px] h-[50px] select-none">
		<input id='${id}' type="checkbox" value='${value ? value : ''}' class="peer sr-only"/>
		<div class="${SVG_BOX_STYLE}">
			${svg}
		</div>
		<div class="${SVG_SELECTED_STYLE}">
			${SVG_SELECTED}
		</div>
	</label>
	`;
}

export { createCheckbox };

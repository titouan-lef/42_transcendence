import { applyColor } from "../utils/applyColor";

/** @todo clamp : better responsivity (not working well here) */
const WELCOME_STYLE = `
flex items-center justify-center h-screen
text-[clamp(100px,50vmin,500px)] text-balance
font-jaro
${applyColor('alt')}
`;

const WELCOME = `
<div class="${WELCOME_STYLE}">
	PONG
</div>
`;

export { WELCOME };

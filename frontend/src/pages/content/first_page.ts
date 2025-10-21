/** @todo clamp : better responsivity (not working well here) */
const CLASS_CSS = `
font-jaro font-bold text-[var(--color-tx-prim)]
text-[clamp(100px,50vmin,500px)] text-balance
flex items-center justify-center h-screen
`;

/** @todo mettre une variable pour les textes (import des langues) ${gameName} */
const FIRST_PAGE = `
<div class="${CLASS_CSS}">
	PONG
</div>
`;

export { FIRST_PAGE };

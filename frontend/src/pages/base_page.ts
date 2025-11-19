const ROW_STYLE = `
flex flex-row gap-[10px]
p-[10px]
min-h-screen max-h-screen
bg-dark
`;

const BASE_PAGE = `
<dialog id="modal"></dialog>
<div id="content" class="${ROW_STYLE}"></div>
`;

export { BASE_PAGE };

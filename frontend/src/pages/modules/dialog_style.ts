import { applyColor } from "../../utils/applyColor";

const DIALOG_BTN_STYLE = `
	p-[5px] rounded-xl
	w-full
	align-center text-center font-bold
	${applyColor()}
`;

const DIALOG_INPUT_STYLE = `
	p-[5px] rounded-xl
	w-full
	align-center text-center font-bold
	${applyColor('input')}
`;

const DIALOG_SEPARATOR_STYLE = `
	rounded-2xl
	w-1/2
	border-2 border-dark
`;

const DIALOG_FORM_STYLE = `
	flex flex-col justify-center items-center gap-3
`;

export { DIALOG_BTN_STYLE, DIALOG_INPUT_STYLE, DIALOG_SEPARATOR_STYLE, DIALOG_FORM_STYLE };

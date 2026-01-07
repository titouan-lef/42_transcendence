import { createButtonHtml } from "../../../components/button";
import { createInputHtml } from "../../../components/input";
import { createParagraphHtml } from "../../../components/paragraph";

const BTN_SAVE_EDIT_STYLE = `
bg-dark text-secondary p-1 rounded-xl font-bold w-[80px]
`;

const BTN_SAVE = `
<div class='flex flex-row justify-between w-full'>
	${createButtonHtml(['cancel'], 'btn-cancel', { 'class': `${BTN_SAVE_EDIT_STYLE} text-warning` })}
	${createButtonHtml(['save'], 'btn-save', { 'class': `${BTN_SAVE_EDIT_STYLE}` })}
</div>
`;

const BTN_EDIT = createButtonHtml(['edit'], 'btn-edit', { 'class': `${BTN_SAVE_EDIT_STYLE}` });

const INPUT_EDITPROFILE_STYLE = `
bg-dark rounded-xl p-2
w-full min-w-0 max-w-9/10 truncate
focus:outline-2 focus:outline-light focus:text-dark
`;

const SHOW_USERINFORMATION_STYLE = `
rounded-xl p-2
w-full min-w-0 max-w-9/10 truncate
`;

const BOX_USERINFORMATION_STYLE = `
flex flex-col justify-start gap-4 w-full pb-4
`;

/** @todo print-content front to do */
const BOX_EDITPROFILE = `
<div class="${BOX_USERINFORMATION_STYLE}">
	${createInputHtml(["nickname"], "text", "publicID", { "class": `${INPUT_EDITPROFILE_STYLE}` })}
	${createInputHtml(["new_password"], "password", "newPassword", { "class": `${INPUT_EDITPROFILE_STYLE}` })}
	${createInputHtml(["confirm_password"], "password", "confirmPassword", { "class": `${INPUT_EDITPROFILE_STYLE}` })}
	${createInputHtml(["tfa_mail"], "email", "user-email", { "class": `${INPUT_EDITPROFILE_STYLE}` })}
	<div id="print-uinfo-reply"></div>
</div>
`;

const BOX_SHOWPROFILE = `
<div class="${BOX_USERINFORMATION_STYLE}">
	<div class='${SHOW_USERINFORMATION_STYLE}' id="show-user-nickname"></div>
	<div class='${SHOW_USERINFORMATION_STYLE}'>password: ******</div>
	<div class='${SHOW_USERINFORMATION_STYLE}' id="show-user-email"></div>
</div>
`;

const SETTINGS_USER_INFOS = `
<div class='flex flex-col w-full flex-1 min-h-[400px] bg-light/10 rounded-2xl p-2'>
	<div class="p-8 flex flex-col">
		${createParagraphHtml(['user_informations'], 'p-uinfo', { 'class': `text-[20px] font-bold` })}
	</div>
	<div id='btn-switch-edit-save' class='flex flex-col items-end w-full pb-4'>
			${BTN_EDIT}
	</div>
	<div id='switch-edit-save' class='w-full flex-1 min-w-0 h-full'>
		${BOX_SHOWPROFILE}
	</div>
</div>
`;

export { SETTINGS_USER_INFOS, BTN_EDIT, BTN_SAVE, BOX_EDITPROFILE, BOX_SHOWPROFILE };

import { createButtonHtml } from "../../../components/button";
import { createInputHtml } from "../../../components/input";
import { createParagraphHtml } from "../../../components/paragraph";

const BTN_SAVE = `
<div class='flex flex-row gap-4'>
	${createButtonHtml(['cancel'], 'btn-cancel', { 'class': `bg-dark text-warning p-1 rounded-2xl font-bold` })}
	${createButtonHtml(['save'], 'btn-save', { 'class': `bg-dark text-secondary p-1 rounded-2xl font-bold` })}
</div>
`;

const BTN_EDIT = createButtonHtml(['edit'], 'btn-edit', { 'class': `bg-dark text-secondary p-1 rounded-2xl font-bold` });

const INPUT_EDITPROFILE_STYLE = `
w-full min-w-0 truncate
`;

const BOX_EDITPROFILE = `
<div class="flex flex-col justify-start gap-4 w-full">
	${createInputHtml(["nickname"], "text", "publicID", { "class": `${INPUT_EDITPROFILE_STYLE}` })}
	${createInputHtml(["new_password"], "password", "newPassword", { "class": `${INPUT_EDITPROFILE_STYLE}` })}
	${createInputHtml(["confirm_password"], "password", "confirmPassword", { "class": `${INPUT_EDITPROFILE_STYLE}` })}
	${createInputHtml(["tfa_mail"], "email", "user-email", { "class": `${INPUT_EDITPROFILE_STYLE}` })}
	<div id="print-uinfo-reply"></div>
</div>
`;

const BOX_SHOWPROFILE = `
<div class="flex flex-col gap-4 w-full">
	<div id="show-user-nickname"></div>
	<div>password: ******</div>
	<div id="show-user-email"></div>
</div>
`;

const SETTINGS_USER_INFOS = `
<div class="p-8 flex flex-col">
	${createParagraphHtml(['user_informations'], 'p-uinfo', { 'class': `text-[20px] font-bold` })}
</div>
<div id='btn-switch-edit-save' class='flex flex-col items-end'>
		${BTN_EDIT}
</div>
<div id='switch-edit-save' class='h-[200px] w-full flex-1 min-w-0'>
	${BOX_SHOWPROFILE}
</div>
`;

export { SETTINGS_USER_INFOS, BTN_EDIT, BTN_SAVE, BOX_EDITPROFILE, BOX_SHOWPROFILE };

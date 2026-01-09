const SETTINGS_2FA_STYLE = `
flex flex-row justify-start items-center w-full
`;

const SETTINGS_LABEL_STYLE = `
mr-2 font-bold w-[70px]
`;

const PRINT_CONTENT_STYLE = `
w-full h-[20px] text-[12px] text-warning text-center
`;

const SETTINGS_2FA_ENABLE = `
<div class='flex flex-col w-full h-full justify-center'>
	<div class='${SETTINGS_2FA_STYLE}'>
		<label class="${SETTINGS_LABEL_STYLE}">2FA: </label>
		<svg id='btn-enable-2fa' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-10 text-warning">
			<path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m0-10.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.25-8.25-3.286Zm0 13.036h.008v.008H12v-.008Z" />
		</svg>
	</div>
	<div id='print-2fa-reply' class='${PRINT_CONTENT_STYLE}'></div>
</div>
`;

const SETTINGS_2FA_DISABLE = `
<div class='flex flex-col w-full h-full justify-center'>
	<div class='${SETTINGS_2FA_STYLE}'>
		<label class="${SETTINGS_LABEL_STYLE}">2FA: </label>
		<svg id='btn-disable-2fa' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-10 text-variant">
			<path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
		</svg>
	</div>
	<div id='print-2fa-reply' class='${PRINT_CONTENT_STYLE}'></div>
</div>
`;

export { SETTINGS_2FA_ENABLE, SETTINGS_2FA_DISABLE };

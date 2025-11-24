/** @todo use this to make styles changes over API calls */

// function connectUser(userID: HTMLInputElement, password: HTMLInputElement, confirmPassword?: HTMLInputElement, publicID?: HTMLInputElement): void {

// 	if (confirmPassword && publicID) {
// 		if (password.value !== confirmPassword.value) {
// 			console.log(`passwords not matching`); /** @todo remove debug logs */
// 			return ;
// 		} else {
// 			console.log(`sign-up button clicked with ${userID.value} and ${password.value}, public nick name is ${publicID.value}`); /** @todo remove debug logs */
// 		}
// 	} else {
// 		console.log(`sign-in button clicked with ${userID.value} and ${password.value}`); /** @todo remove debug logs */
// 	}

// 	const modal = getSafeElement('modal', HTMLDialogElement);
// 	const asideElem = getSafeElement('aside', HTMLElement);
// 	const mainElem = getSafeElement('main', HTMLElement);
// 	const mainPlayButtonElem = getSafeElement('main-play-btn', HTMLInputElement);

// 	modal.close();
// 	asideElem.innerHTML = ASIDE_CONNECTED;
// 	mainElem.className = `${MAIN_STYLE} ${applyColor()}`;
// 	mainPlayButtonElem.className = `${PLAY_BTN_STYLE} ${applyColor('alt')}`;
// 	// mainelem.attributeStyleMap.set("bg-color", "bg-secondary");

// 	addHandler("btn-profile", "click", () => loadDialog(signInHandler, SIGN_IN));
// 	addHandler("add-friend", "click", () => console.log("adding friend...")); /** @todo remove debug logs */
// 	addHandler("btn-log-out", "click", () => disconnectUser());
// }

// function disconnectUser():void {
// 	console.log("user logging out..."); /** @todo remove debug logs */

// 	const modal = getSafeElement('modal', HTMLDialogElement);
// 	const asideElem = getSafeElement('aside', HTMLElement);
// 	const mainElem = getSafeElement('main', HTMLElement);
// 	const mainPlayButtonElem = getSafeElement('main-play-btn', HTMLInputElement);

// 	asideElem.innerHTML = ASIDE_NOT_CONNECTED;
// 	mainElem.className = `${MAIN_STYLE} ${applyColor('alt')}`;
// 	mainPlayButtonElem.className = `${PLAY_BTN_STYLE} ${applyColor()}`;

// 	// signInHandler(modal);
// 	// signUpHandler(modal);
// }

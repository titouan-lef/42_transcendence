/**	@todo friendlist test front bellow, maybe move it to appropriate folder if linked to back */

// const FRIENDLIST = [
// 	"friend_1",
// 	"fd_2",
// 	"friend_3",
// 	"friend_4_with_too_long_name",
// 	"friend_5",
// 	"friend_6",
// 	"friendd_7",
// ];

// function closeAllDetails(): void {
// 	FRIENDLIST.forEach(friend => {
// 		const elem = getSafeElement(friend, HTMLDetailsElement);

// 		if (elem.open) {
// 			elem.open = false;
// 		}
// 	});
// }

// function generateFriendList(): void {
// 	const elem = getSafeElement("friendlist", HTMLElement);

// 	FRIENDLIST.forEach(friend => {
// 		elem.innerHTML += `
// 			<details id="${friend}" class="rounded-2xl ${applyColor()} w-full">
// 				<summary class="list-none cursor-pointer p-[5px]">
// 					<p class="text-center overflow-hidden text-ellipsis" title="${friend}">${friend}</p>
// 				</summary>
// 				<div class="rounded-xl bg-primary w-auto p-[5px] m-[5px] flex flex-col justify-center items-center">
// 					${createButtonHtml(["profile"], `btn-profile-${friend}`, { "class": "text-tx-prim text-center w-full" })}
// 					<button class="text-tx-prim text-center w-full">invite</button>
// 					<hr class="border-1 border-variant w-full my-1">
// 					<input id="delete-friend-${friend}" type="button" value="delete" class="text-warning font-bold text-center w-full"/>
// 				</div>
// 			</details>
// 		`;
// 	});

// 	FRIENDLIST.forEach(friend => {
// 		addHandler(`btn-profile-${friend}`, "click", () => console.log(`je consulte le profil de ${friend}`));
// 		addHandler(`delete-friend-${friend}`, "click", () => console.log(`je delete ${friend}`));
// 		addHandler(friend, "click", () => closeAllDetails());
// 	});
// }

// function addFriend(): void {
// 	//setLang('fr'); /** @todo remove here */
// 	console.log("CLICK ADD FRIEND");
// 	// FRIENDLIST.push("new_friend");
// 	generateFriendList();
// }

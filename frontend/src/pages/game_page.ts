import { newGameVsAI, newLocalGame, newRankedGame } from "../services/api_request";
import { getSafeElement } from "../utils/getSafeElement";

const GAME_PAGE =`
  <main>
    <section class="flex flex-col gap-4 justify-center items-center">
      <input id="btn-theme" type="button" value="Themes" class="bg-primary text-2xl text-dark rounded-2xl p-4"/>
      <input id="btn-user" type="button" value="Users" class="bg-primary text-2xl text-dark rounded-2xl p-4"/>
      <input id="btn-play-ranked" type="button" value="Ranked" class="bg-primary text-2xl text-dark rounded-2xl p-4"/>
      <input id="btn-play-local" type="button" value="Local 2 Players" class="bg-primary text-2xl text-dark rounded-2xl p-4"/>
      <input id="btn-play-AI" type="button" value="Local vs AI" class="bg-primary text-2xl text-dark rounded-2xl p-4"/>
      <div id="print-content" class="response-box"></div>
    </section>
  </main>
`;

function gamePageEvents(): void {
	const ranked = getSafeElement('btn-play-ranked', HTMLElement);
	const local = getSafeElement('btn-play-local', HTMLElement);
	const ai = getSafeElement('btn-play-AI', HTMLElement);

	ranked.addEventListener('click', newRankedGame);
	local.addEventListener('click', newLocalGame);
	ai.addEventListener('click', newGameVsAI);
}

export { GAME_PAGE, gamePageEvents };

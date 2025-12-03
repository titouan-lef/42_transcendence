import { stopGame } from "../canvas_creation";
import { BallOption, MapOption } from "../settings/GameSettings";
import { GameStats } from "../types_transfert";

export class GameStatistics {
	private readonly stats: HTMLDivElement;
	private readonly rules: HTMLDivElement;

	constructor(gameStats: GameStats) {
		this.stats = this.createStatsDiv();

		this.rules = this.createRulesList(gameStats);
		

		const btnClose = document.createElement("button");
		btnClose.textContent = "Close";
		btnClose.style.marginTop = "20px";
		btnClose.onclick = (): void => {
			stopGame();
			this.stats?.remove();
		};

		const btnRules = document.createElement("button");
		btnRules.textContent = "Show Rules";
		btnRules.style.marginTop = "20px";
		btnRules.style.marginLeft = "20px";
		btnRules.onclick = (): void => {
			if (this.rules.style.visibility === "hidden")
				this.rules.style.visibility = "visible";
			else
				this.rules.style.visibility = "hidden";
		};

		this.stats.appendChild(btnClose);
		this.stats.appendChild(btnRules);
		document.body.appendChild(this.stats);
		document.body.appendChild(this.rules);
	}

	private createRulesList(gameStats: GameStats): HTMLDivElement {
		const rules = this.createStatsDiv();

		const maps = document.createElement("div");
		maps.textContent = "Maps: " + this.listToString(gameStats.rules.mapOptions);

		const balls = document.createElement("div");
		balls.textContent = "Balls: " + this.listToString(gameStats.rules.ballOptions);

		const time = document.createElement("div");
		time.textContent = this.timeToString(gameStats.gameTimer);

		rules.appendChild(maps);
		rules.appendChild(balls);
		rules.appendChild(time);

		rules.style.visibility = "hidden";
		return rules;
	}

	private createStatsDiv(): HTMLDivElement {
		const stats = document.createElement("div");
		stats.style.position = "fixed";
		stats.style.top = "0";
		stats.style.left = "0";
		stats.style.width = "100%";
		stats.style.height = "100%";
		stats.style.background = "rgba(0,0,0,0.6)";
		stats.style.display = "flex";
		stats.style.flexDirection = "column";
		stats.style.justifyContent = "center";
		stats.style.alignItems = "center";
		stats.style.color = "white";
		stats.style.fontSize = "24px";

		return stats;
	}

	private listToString(list: MapOption[] | BallOption[]): string {
		let listString = "";
		for (let i = 0; i < list.length; i++) {
			listString += list[i];
			if (i !== list.length - 1)
				listString += " / ";
		}

		return listString;
	}

	private timeToString(time: number): string {
		const minutes = Math.floor(time / 60);
		const seconds = time % 60;

		let timeString = "Game Duration: ";
		timeString += minutes;
		timeString += "m";
		if (seconds === 0)
			return timeString + "00";
		if (seconds < 10)
			timeString += "0";
		timeString += seconds;

		return timeString;
	}
}
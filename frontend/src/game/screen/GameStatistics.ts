import { stopGame } from "../canvas_creation";
import { BallOption, MapOption } from "../settings/PointSettings";
import { GameStats } from "../types_transfert";

class GameStatistics {
	private readonly stats: HTMLDivElement;
	private readonly rules: HTMLDivElement;
	private readonly background: HTMLDivElement;

	constructor(gameStats: GameStats) {
		this.background = this.createBackGround();

		this.stats = this.createStatsDiv();
		this.createStats(gameStats);

		this.rules = this.createRulesDiv();
		this.createRules(gameStats);

		const btnClose = this.createButtonClose();
		const btnRules = this.createButtonRules();

		this.stats.appendChild(this.rules);
		this.background.appendChild(this.stats);
		this.background.appendChild(btnClose);
		this.background.appendChild(btnRules);
		document.body.appendChild(this.background);
	}

	private createStats(gameStats: GameStats): void {
		const time = document.createElement("div");
		time.textContent = "Game Duration: " + this.timeToString(gameStats.gameTimer);
		this.stats.appendChild(time);

		const name1 = document.createElement("div");
		name1.textContent = gameStats.player1.name + "	score: " + gameStats.player1.score;
		this.stats.appendChild(name1);

		const name2 = document.createElement("div");
		name2.textContent = gameStats.player2.name + "	score: " + gameStats.player2.score;
		this.stats.appendChild(name2);

		const points = document.createElement("div");
		points.textContent = "Points: \n";
		this.stats.appendChild(points);
		this.pointToString(gameStats, points);
	}

	private createRules(gameStats: GameStats): void {
		const maps = document.createElement("div");
		maps.textContent = "Maps: " + this.listToString(gameStats.rules.mapOptions);
		this.rules.appendChild(maps);

		const balls = document.createElement("div");
		balls.textContent = "Balls: " + this.listToString(gameStats.rules.ballOptions);
		this.rules.appendChild(balls);

		const rotatingPlayer = document.createElement("div");
		rotatingPlayer.textContent = "RotatingPlayer: " + (gameStats.rules.rotatingPlayer ? "On" : "Off");
		this.rules.appendChild(rotatingPlayer);

		const spin = document.createElement("div");
		spin.textContent = "Spin: " + (gameStats.rules.spin ? "On" : "Off");
		this.rules.appendChild(spin);

		const dashingPlayer = document.createElement("div");
		dashingPlayer.textContent = "DashingPlayer: " + (gameStats.rules.dashingPlayer ? "On" : "Off");
		this.rules.appendChild(dashingPlayer);

		const windAffectsBall = document.createElement("div");
		windAffectsBall.textContent = "WindAffectsBall: " + (gameStats.rules.windAffectsBall ? "On" : "Off");
		this.rules.appendChild(windAffectsBall);

		const canonCount = document.createElement("div");
		canonCount.textContent = "CanonCount: " + gameStats.rules.canonCount;
		this.rules.appendChild(canonCount);

		this.rules.style.visibility = "hidden";
	}

	private createBackGround(): HTMLDivElement {
		const background = document.createElement("div");

		background.style.position = "fixed";
		background.style.top = "10%";
		background.style.left = "10%";
		background.style.width = "80%";
		background.style.height = "80%";
		background.style.background = "rgba(0,0,0,0.6)";
		background.style.display = "flex";
		background.style.flexDirection = "column";
		background.style.justifyContent = "center";
		background.style.alignItems = "center";

		return background;
	}

	private createStatsDiv(): HTMLDivElement {
		const stats = document.createElement("div");

		stats.style.display = "flex";
		stats.style.flexDirection = "column";
		stats.style.justifyContent = "center";
		stats.style.alignItems = "center";
		stats.style.color = "white";
		stats.style.fontSize = "24px";

		return stats;
	}

	private createRulesDiv(): HTMLDivElement {
		const rules = document.createElement("div");

		rules.style.display = "flex";
		rules.style.flexDirection = "column";
		rules.style.justifyContent = "center";
		rules.style.alignItems = "center";
		rules.style.color = "white";
		rules.style.fontSize = "24px";

		return rules;
	}

	private createButtonClose(): HTMLButtonElement {
		const btnClose = document.createElement("button");
		btnClose.textContent = "Close";
		btnClose.style.marginTop = "20px";
		btnClose.onclick = (): void => {
			stopGame();
			this.background?.remove();
		};

		return btnClose;
	}

	private createButtonRules(): HTMLButtonElement {
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

		return btnRules;
	}

	private pointToString(gameStats: GameStats, pointDiv: HTMLDivElement): void {
		const points = gameStats.points;
		let goaler: string;
		points.forEach(point => {
			goaler = point.goaler === 1 ? gameStats.player1.name : gameStats.player2.name;
			const newPointDiv = document.createElement("div");
			newPointDiv.textContent = goaler + " has goaled with " + point.ball + "ball on " + point.map + "Map at " + this.timeToString(point.timer) + ".";
			pointDiv.appendChild(newPointDiv);
		});
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

		let timeString = "";
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

export { GameStatistics };

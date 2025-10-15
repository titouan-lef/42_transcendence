import * as babylon from "/babylonjs/index.js";
import { BallTemplate } from "./Balls/ballTemplate.js";
import { DefaultBall } from "./Balls/defaultBall.js";
import { InvisibleBall } from "./Balls/invisibleBall.js";
import { HeavyBall } from "./Balls/heavyBall.js";
import { TrickyBall } from "./Balls/trickyBall.js";
import { SnakeBall } from "./Balls/snakeBall.js";
import { MapTemplate } from "./Maps/mapTemplate.js";
import { DefaultMap } from "./Maps/defaultMap.js";
import { FrozenMap } from "./Maps/frozenMap.js";
import { RainyMap } from "./Maps/rainyMap.js";
import { VolcanoMap } from "./Maps/volcanoMap.js";
import { WindyMap } from "./Maps/windyMap.js";
import { Player } from "./player.js";
import { GameSettings, MapOption, BallOption } from "./gameSettings.js";
import { MAP_SIZE, PLAYER_DIMENSION, WALL_WIDTH } from "./values.js";


export class SceneManager {
	readonly balls: BallTemplate[] = [];
	readonly maps: MapTemplate[] = [];
	readonly players: Player[] = [];

	/**@todo Enum here is kinda hard to use because each class is different */
	createBall(scene: babylon.Scene, ball: BallOption): void {
		const ballList: BallOption[] = ["default", "invisible", "tricky", "heavy", "snake"];
		if (ball === "random") {
			ball = ballList[Math.floor(Math.random() * 5)];
		}
		switch (ball) {
			case "default":
				this.balls.push(new DefaultBall(scene));
				break;
			case "invisible":
				this.balls.push(new InvisibleBall(scene));
				break;
			case "tricky":
				this.balls.push(new TrickyBall(scene));
				break;
			case "heavy":
				this.balls.push(new HeavyBall(scene));
				break;
			case "snake":
				this.balls.push(new SnakeBall(scene));
				break;
			default: ;
		}
	}

	/**@todo Enum here is kinda hard to use because each class is different */
	createMap(scene: babylon.Scene, map: MapOption): void {
		const mapList: MapOption[] = ["default", "volcano", "windy", "frozen", "rainy"];
		if (map === "random") {
			map = mapList[Math.floor(Math.random() * 5)];
		}
		switch (map) {
			case "default":
				this.maps.push(new DefaultMap(scene));
				break;
			case "volcano":
				this.maps.push(new VolcanoMap(scene));
				break;
			case "windy":
				this.maps.push(new WindyMap(scene));
				break;
			case "frozen":
				this.maps.push(new FrozenMap(scene));
				break;
			case "rainy":
				this.maps.push(new RainyMap(scene));
				break;
			default: ;
		}
	}

	createPlayers(scene: babylon.Scene, settings: GameSettings): void {
		const player1 = new Player(scene, settings, settings.player1Keys);
		player1.mesh.position.x = MAP_SIZE.x / 2 - (PLAYER_DIMENSION.x * 2 + WALL_WIDTH);
		const player2 = new Player(scene, settings, settings.player2Keys);
		player2.mesh.position.x = (PLAYER_DIMENSION.x * 2 + WALL_WIDTH) -(MAP_SIZE.x / 2);
		this.players.push(player1);
		this.players.push(player2);
	}

	setEnvironnement(scene: babylon.Scene, settings: GameSettings): void {
		this.createPlayers(scene, settings);
		this.createBall(scene, settings.ball);
		this.createMap(scene, settings.map);
	}

	destroyEnvironnement(): void {
		this.destroyBalls();
		this.destroyMaps();
		this.destroyPlayers();
	}

	destroyBalls(): void {
		this.balls.forEach(ball => ball.destroy());
	}

	destroyMaps(): void  {
		this.maps.forEach(map => map.destroy());
	}

	destroyPlayers(): void {
		this.players.forEach(player => player.destroy());
	}
}
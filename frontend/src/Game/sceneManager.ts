import * as babylon from "/babylonjs/core/index.js";
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
		const player1PosX = MAP_SIZE.x / 2 - (PLAYER_DIMENSION.z + WALL_WIDTH);
		const player2PosX = (PLAYER_DIMENSION.z + WALL_WIDTH) -(MAP_SIZE.x / 2);
		const playersPoxY = PLAYER_DIMENSION.y / 2;
		const player1 = new Player(scene, new babylon.Vector2(player1PosX, playersPoxY), settings, settings.player1Keys);
		const player2 = new Player(scene, new babylon.Vector2(player2PosX, playersPoxY), settings, settings.player2Keys);
		this.players.push(player1);
		this.players.push(player2);
	}

	setEnvironnement(scene: babylon.Scene, settings: GameSettings): void {
		this.createPlayers(scene, settings);
		this.createBall(scene, settings.ball);
		this.createMap(scene, settings.map);
	}

	destroyEnvironnement(scene: babylon.Scene): void {
		this.destroyBalls();
		this.destroyMaps();
		this.destroyPlayers();
		while(this.balls.length > 0) {
			this.balls.pop();
		}
		this.maps.pop();
		while(this.players.length > 0) {
			this.players.pop();
		}
		scene.materials.forEach(mat => mat.dispose());
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
import * as babylon from "@babylonjs/core";
import { BallTemplate } from "./ball/BallTemplate.js";
import { DefaultBall } from "./ball/DefaultBall.js";
import { InvisibleBall } from "./ball/InvisibleBall.js";
import { PulseBall } from "./ball/PulseBall.js";
import { TrickyBall } from "./ball/TrickyBall.js";
import { SnakeBall } from "./ball/SnakeBall.js";
import { MapTemplate } from "./map/MapTemplate.js";
import { DefaultMap } from "./map/DefaultMap.js";
import { FrozenMap } from "./map/FrozenMap.js";
import { RainyMap } from "./map/RainyMap.js";
import { VolcanoMap } from "./map/VolcanoMap.js";
import { WindyMap } from "./map/WindyMap.js";
import { Player } from "./Player.js";
import { GameSettings, MapOption, BallOption } from "./GameSettings.js";
import { MAP_SIZE, PLAYER_DIMENSION, WALL_WIDTH } from "./values.js";


export class SceneManager {
	private readonly balls: BallTemplate[] = [];
	private readonly maps: MapTemplate[] = [];
	private readonly players: Player[] = [];
	private readonly textures: Record<string, babylon.Texture> = {};

	/**@todo will be removed */
	getBalls(): BallTemplate[] {
		return this.balls;
	}

	/**@todo Enum here is kinda hard to use because each class is different */
	createBall(scene: babylon.Scene, settings: GameSettings): void {
		const ballList: BallOption[] = ["default", "invisible", "tricky", "pulse", "snake"];
		let ball = settings.ball;
		if (settings.ball === "random") {
			ball = ballList[Math.floor(Math.random() * 5)];
		}
		switch (ball) {
			case "default":
				this.balls.push(new DefaultBall(scene, this.textures));
				break;
			case "invisible":
				this.balls.push(new InvisibleBall(scene, this.textures));
				break;
			case "tricky":
				this.balls.push(new TrickyBall(scene, this.textures));
				break;
			case "pulse":
				this.balls.push(new PulseBall(scene, this.textures));
				break;
			case "snake":
				this.balls.push(new SnakeBall(scene, this.textures));
				break;
			default: throw new Error("switch ball fail");
		}
	}

	createMap(scene: babylon.Scene, map: MapOption): void {
		const mapList: MapOption[] = ["default", "volcano", "windy", "frozen", "rainy"];
		if (map === "random") {
			map = mapList[Math.floor(Math.random() * 5)];
		}
		switch (map) {
			case "default":
				this.maps.push(new DefaultMap(scene, this.textures.particle));
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
			default: throw new Error("switch map fail");
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

	createTextures(scene: babylon.Scene): void {
		this.textures.spark = new babylon.Texture("textures/sparks.png", scene);
		this.textures.flare = new babylon.Texture("textures/flare.png", scene);
		this.textures.particle = new babylon.Texture("textures/particle.png", scene);
	}

	/** @todo Titouan gaming */
	checkGoal(): { goal: "player1" | "player2" | null, position: babylon.Vector3 | null } | null {
		for (const ball of this.balls) {
			const goalInfos = ball.getGoal();
			if (goalInfos.goal !== null) {
				return goalInfos;
			}
		};
		return null;
	}

	/** ball explodes, the time slow down */
	async goalAnimation(engine: babylon.Engine, scene: babylon.Scene, position: babylon.Vector3, score: babylon.Vector2): Promise<void> {
		this.balls.forEach( ball => {
			ball.preDeath();
			ball.showParticles(position, scene, "explosion"); /**@todo change position here */
		});
		this.updateScore(score);
		const originalGetDelta = engine.getDeltaTime; // keep original delta
		engine.getDeltaTime = function(): number {
			return originalGetDelta.call(this) * 0.01; // slow animations
		};
		await new Promise<void>(resolve => { 	
			setTimeout( () => {
				resolve();
			}, 2700);
		});
		engine.getDeltaTime = originalGetDelta;// set back to original speed
	}

	private updateScore(score: babylon.Vector2): void {
		this.maps.forEach( map => {
			map.changeScore([score.x, score.y]);
		});
	}

	setEnvironnement(scene: babylon.Scene, settings: GameSettings, score: babylon.Vector2): void {
		this.createPlayers(scene, settings);
		this.createBall(scene, settings);
		this.createMap(scene, settings.map);
		this.updateScore(score);
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
		scene.materials.forEach(mat => mat.dispose()); // these are the defualt materials, not sure if i have to dispose them since they are created auto
		/**@todo Debugging logs */
		// console.log("meshes : " + scene.meshes);
		// console.log("materials : " + scene.materials);
		// scene.materials.forEach(mat => {
		// 	console.log("mat name : " + mat.name);
		// });
		// console.log("textures : " + scene.textures);
		// scene.textures.forEach(texture => {
		// 	console.log("texture name : " + texture.name);
		// });
		// console.log("lights : " + scene.lights);
	}

	destroyTextures(): void {
		for (const texture in this.textures) {
			this.textures[texture].dispose();
		}
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

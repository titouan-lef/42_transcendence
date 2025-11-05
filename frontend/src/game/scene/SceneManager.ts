import * as babylon from "@babylonjs/core";
import { BallTemplate } from "../ball/BallTemplate.js";
import { Score } from "./Score.js";
import { DefaultBall } from "../ball/DefaultBall.js";
import { InvisibleBall } from "../ball/InvisibleBall.js";
import { PulseBall } from "../ball/PulseBall.js";
import { TrickyBall } from "../ball/TrickyBall.js";
import { SnakeBall } from "../ball/SnakeBall.js";
import { MapTemplate } from "../map/MapTemplate.js";
import { DefaultMap } from "../map/DefaultMap.js";
import { RainyMap } from "../map/RainyMap.js";
import { VolcanoMap } from "../map/VolcanoMap.js";
import { Player } from "../player/Player.js";
import { GameSettings, MapOption, BallOption } from "../settings/GameSettings.js";
import { MAP_SIZE, PLAYER_DIMENSION, WALL_WIDTH } from "../settings/values.js";

export class SceneManager {
	private ball: BallTemplate | null = null;
	private map: MapTemplate | null = null;
	private readonly players: Player[] = [];
	private readonly textures: Record<string, babylon.Texture> = {};
	private score: Score;

	constructor(scene: babylon.Scene, camera: babylon.ArcRotateCamera) {
		this.score = new Score(scene, camera);
	}

	/**@todo will be removed */
	getBall(): BallTemplate | null {
		return this.ball;
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
				this.ball = new DefaultBall(scene, this.textures);
				break;
			case "invisible":
				this.ball = new InvisibleBall(scene, this.textures);
				break;
			case "tricky":
				this.ball = new TrickyBall(scene, this.textures);
				break;
			case "pulse":
				this.ball = new PulseBall(scene, this.textures);
				break;
			case "snake":
				this.ball = new SnakeBall(scene, this.textures);
				break;
			default: throw new Error("switch ball fail");
		}
	}

	createMap(scene: babylon.Scene, map: MapOption): void {
		const mapList: MapOption[] = ["default", "volcano", "rainy"];
		if (map === "random") {
			map = mapList[Math.floor(Math.random() * 3)];
		}
		switch (map) {
			case "default":
				this.map = new DefaultMap(scene, this.textures.stars);
				break;
			case "volcano":
				this.map = new VolcanoMap(scene, this.textures);
				break;
			case "rainy":
				this.map = new RainyMap(scene, this.textures);
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
		this.textures.spark = new babylon.Texture("textures/sparks.png", scene, true, false, babylon.Texture.BILINEAR_SAMPLINGMODE);
		this.textures.flare = new babylon.Texture("textures/flare.png", scene, true, false, babylon.Texture.BILINEAR_SAMPLINGMODE);
		this.textures.stars = new babylon.Texture("textures/particle.png", scene, true, false, babylon.Texture.BILINEAR_SAMPLINGMODE);
		this.textures.rain = new babylon.Texture("textures/rain.png", scene, true, false, babylon.Texture.BILINEAR_SAMPLINGMODE);
		this.textures.smoke = new babylon.Texture("textures/smoke.png", scene, true, false, babylon.Texture.BILINEAR_SAMPLINGMODE);
		this.textures.electricity = new babylon.Texture("textures/electricity.png", scene, true, false, babylon.Texture.BILINEAR_SAMPLINGMODE);
		for (const key in this.textures) {
			this.textures[key].hasAlpha = true;
			this.textures[key].wrapU = babylon.Texture.CLAMP_ADDRESSMODE;
			this.textures[key].wrapV = babylon.Texture.CLAMP_ADDRESSMODE;
		}
	}

	/** @todo Titouan gaming */
	checkGoal(): { goal: "player1" | "player2" | null, position: babylon.Vector3 | null } | null {
		const goalInfos = this.ball?.getGoal();
		if (goalInfos && goalInfos.goal !== null) {
			return goalInfos;
		}
		return null;
	}

	/** ball explodes, the time slow down */
	async goalAnimation(engine: babylon.Engine, scene: babylon.Scene, position: babylon.Vector3, score: babylon.Vector2): Promise<void> {
		if (this.map)
			this.map.predeath();
		this.ball?.preDeath();
		this.ball?.showParticles(position, scene, "explosion"); /**@todo change position here */
		this.score.changeScore([score.x, score.y]);
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

	setEnvironnement(scene: babylon.Scene, settings: GameSettings, score: babylon.Vector2): void {
		this.createPlayers(scene, settings);
		this.createBall(scene, settings);
		this.createMap(scene, settings.map);
		this.score.changeScore([score.x, score.y]);
	}

	destroyEnvironnement(scene: babylon.Scene): void {
		this.destroyBall();
		this.destroyMap();
		this.destroyPlayers();
		this.ball = null;
		this.map = null;
		while(this.players.length > 0) {
			this.players.pop();
		}
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
		// console.log("particle system: " + scene.particleSystems);
	}

	destroyTextures(): void {
		for (const texture in this.textures) {
			this.textures[texture].dispose();
		}
	}

	destroyBall(): void {
		this.ball?.destroy();
	}

	destroyMap(): void  {
		this.map?.destroy();
	}

	destroyPlayers(): void {
		this.players.forEach(player => player.destroy());
	}

	destroyScore(): void {
		this.score.destroy();
	}
}

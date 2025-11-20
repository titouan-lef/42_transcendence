import * as babylon from "@babylonjs/core";
import { BallTemplate } from "../ball/BallTemplate.js";
import { DefaultBall } from "../ball/DefaultBall.js";
import { InvisibleBall } from "../ball/InvisibleBall.js";
import { PulseBall } from "../ball/PulseBall.js";
import { TrickyBall } from "../ball/TrickyBall.js";
import { SnakeBall } from "../ball/SnakeBall.js";
import { MapTemplate } from "../map/MapTemplate.js";
import { DefaultMap } from "../map/DefaultMap.js";
import { SkyMap } from "../map/SkyMap.js";
import { DesertMap } from "../map/DesertMap.js";
import { VolcanoMap } from "../map/VolcanoMap.js";
import { Player } from "../player/Player.js";
import { GameSettings, MapOption, BallOption } from "../settings/GameSettings.js";
import { MAP_SIZE, PLAYER_DIMENSION, START_TIMEOUT, WALL_WIDTH } from "../settings/values.js";
import { WebSocket } from "ws";
import { Status, TimingMessage } from "../../web_sockets/types_transfert.js";

export class SceneManager {
	private ball: BallTemplate | null = null;
	private map: MapTemplate | null = null;
	// private countDown: CountDown | null = null;
	private readonly players: Player[] = [];
	// private readonly textures: Record<string, babylon.Texture> = {};
	// private score: Score;

	constructor() {
		// this.score = new Score(scene, camera);
	}

	getBall(): BallTemplate | null {
		return this.ball;
	}

	getMapType(): MapOption {
		const type = this.map?.getType();
		if (!type)
			return "default";
		return type;
	}

	getPlayer1(): Player | undefined { /** @todo same player management that in the front */
		return this.players.at(0);
	}

	getPlayer2(): Player | undefined {
		return this.players.at(1);
	}

	private createBall(scene: babylon.Scene, settings: GameSettings): void {
		const ballList: BallOption[] = ["default", "invisible", "tricky", "pulse", "snake"];
		let ball = settings.ball;
		if (settings.ball === "random") {
			ball = ballList[Math.floor(Math.random() * 5)];
		}
		switch (ball) {
			case "default":
				this.ball = new DefaultBall(scene);
				break;
			case "invisible":
				this.ball = new InvisibleBall(scene);
				break;
			case "tricky":
				this.ball = new TrickyBall(scene);
				break;
			case "pulse":
				this.ball = new PulseBall(scene);
				break;
			case "snake":
				this.ball = new SnakeBall(scene);
				break;
			default: 
				throw new Error("switch ball fail");
		}
	}

	private createMap(scene: babylon.Scene, settings: GameSettings): void {
		const mapList: MapOption[] = ["default", "volcano", "sky", "desert"];
		let map = settings.map;
		if (map === "random") {
			map = mapList[Math.floor(Math.random() * 4)];
		}
		const sockets: WebSocket[] = [];
		sockets.push(settings.player1.socket); /** @todo do not add if AI */
		sockets.push(settings.player2.socket); /** @todo do not add if AI */
		switch (map) {
			case "default":
				this.map = new DefaultMap(scene);
				break;
			case "volcano":
				this.map = new VolcanoMap(scene, sockets);
				break;
			case "sky":
				this.map = new SkyMap(scene, sockets);
				break;
			case "desert":
				this.map = new DesertMap(scene, sockets);
				break;
			default: 
				throw new Error("switch map fail");
		}
	}

	createPlayers(scene: babylon.Scene, settings: GameSettings): void {
		const player1PosX = MAP_SIZE.x / 2 - (PLAYER_DIMENSION.z + WALL_WIDTH);
		const player2PosX = (PLAYER_DIMENSION.z + WALL_WIDTH) -(MAP_SIZE.x / 2);
		const playersPoxY = PLAYER_DIMENSION.y / 2;
		const player1 = new Player(scene, new babylon.Vector2(player1PosX, playersPoxY), settings, settings.player1);
		const player2 = new Player(scene, new babylon.Vector2(player2PosX, playersPoxY), settings, settings.player2);
		this.players.push(player1);
		this.players.push(player2);
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
		/** @todo send DeltaTime to the front ? */
	}

	private async sendCountDown(player1: Player, player2: Player, countdow: number) : Promise<void> {
		const time: TimingMessage = {
			status: Status.TIMING,
			time : countdow
		};
		player1.send(time);
		player2.send(time);
	}

	startCountdown(time: number): void {
		const interval = setInterval(() => {
			const player1 = this.getPlayer1();
			const player2 = this.getPlayer2();
			if (!player1 || !player2)
				return;
			this.sendCountDown(player1, player2, time);
			if (time <= 0) {
				clearInterval(interval);
				this.ball?.launchBall();
				this.map?.start();
			}
			time--;

		}, 1000);
	}

	setEnvironnement(scene: babylon.Scene, settings: GameSettings, score: babylon.Vector2): void {
		this.createBall(scene, settings);
		this.createMap(scene, settings);
		this.startCountdown(START_TIMEOUT);
	}

	destroyEnvironnement(scene: babylon.Scene): void {
		this.destroyBall();
		this.destroyMap();
		// this.ball = null; // repetition
		// this.map = null;
	}

	/** debug function */
	showDisposeLogs(scene: babylon.Scene): void {
		console.log("meshes : " + scene.meshes);
		console.log("materials : " + scene.materials);
		scene.materials.forEach(mat => {
			console.log("mat name : " + mat.name);
		});
		console.log("textures : " + scene.textures);
		console.log("lights : " + scene.lights);
		console.log("particle system: " + scene.particleSystems);
	}

	private destroyBall(): void {
		this.ball?.destroy();
		this.ball = null;
	}

	private destroyMap(): void {
		this.map?.destroy();
		this.map = null;
	}

	private destroyPlayers(): void {
		this.players.forEach(player => player.destroy());
	}

	destroyScene(scene: babylon.Scene): void {
		this.destroyPlayers();
		this.destroyEnvironnement(scene);
	}
}

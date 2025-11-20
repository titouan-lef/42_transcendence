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
import { EventMessage, ParticlesType, PlanePosition, Position, RenderMessage, Status, TimingMessage } from "../../web_sockets/types_transfert.js";

export class SceneManager {
	private ball: BallTemplate | null = null;
	private map: MapTemplate | null = null;
	private readonly players: Player[] = [];
	private engine: babylon.Engine;
	private originalGetDelta: () => number;
	private countdownIntervalId: ReturnType<typeof setInterval> | null = null;
	private gameStopped = false;

	constructor(engine: babylon.Engine) {
		this.engine = engine;
		this.originalGetDelta = engine.getDeltaTime; // keep original delta time
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

	getWind(): PlanePosition {
		if (this.map)
			return this.map.getWind();
		return { x: 0, z: 0 };
	}

	getPlayer(number: number): Player | undefined {
		const player = this.players.find(
			(p) => p.getId() === number
		);
		return player;
	}

	private createBall(scene: babylon.Scene, settings: GameSettings): void {
		const ballList: BallOption[] = ["default", "invisible", "tricky", "pulse", "snake"];
		let ball = settings.ball;
		if (settings.ball === "random") {
			ball = ballList[Math.floor(Math.random() * 5)];
		}
		const sockets: WebSocket[] = [];
		sockets.push(settings.player1.socket); /** @todo do not add if AI */
		sockets.push(settings.player2.socket);
		switch (ball) {
			case "default":
				this.ball = new DefaultBall(scene, sockets);
				break;
			case "invisible":
				this.ball = new InvisibleBall(scene, sockets);
				break;
			case "tricky":
				this.ball = new TrickyBall(scene, sockets);
				break;
			case "pulse":
				this.ball = new PulseBall(scene, sockets);
				break;
			case "snake":
				this.ball = new SnakeBall(scene, sockets);
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
		sockets.push(settings.player2.socket);
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
	checkGoal(): { goal: "player1" | "player2" | null, position: Position | null } | null {
		const goalInfos = this.ball?.getGoal();
		if (goalInfos && goalInfos.goal !== null) {
			return goalInfos;
		}
		return null;
	}

	/** ball explodes, the time slow down */
	async goalAnimation(position: Position): Promise<void> {
		if (this.map)
			this.map.predeath();
		this.ball?.preDeath();
		const player1 = this.getPlayer(1);
		const player2 = this.getPlayer(2);
		if (!player1 || !player2)
			return;
		this.sendParticuleEvent(player1, player2, "explosion", position);
		const originalGetDelta = this.originalGetDelta; // keep original delta
		this.engine.getDeltaTime = function(): number {
			return originalGetDelta.call(this) * 0.01; // slow animations
		};
		this.sendDeltaTime(player1, player2, this.engine.getDeltaTime());
		await new Promise<void>(resolve => {
			setTimeout( () => {
				resolve();
			}, 2700);
		});
	}

	private sendDeltaTime(player1: Player, player2: Player, deltaTime: number): void {
		const time: RenderMessage = {
			status: Status.RENDER,
			deltaTime : deltaTime
		};
		player1.send(time);
		player2.send(time);
	}

	private async sendParticuleEvent(player1: Player, player2: Player, type: ParticlesType, position: Position) : Promise<void> {
		const time: EventMessage = {
			status: Status.EVENT,
			type : type,
			position: position
		};
		player1.send(time);
		player2.send(time);
	}

	private async sendCountDown(player1: Player, player2: Player, countdown: number) : Promise<void> {
		const time: TimingMessage = {
			status: Status.TIMING,
			time : countdown
		};
		player1.send(time);
		player2.send(time);
	}

	doesGameEnded(): boolean {
		return this.gameStopped;
	}

	startCountdown(time: number): ReturnType<typeof setInterval> {
		const countdownIntervalId = setInterval(() => {
			const player1 = this.getPlayer(1);
			const player2 = this.getPlayer(2);
			if (!player1 || !player2)
				return;
			this.sendCountDown(player1, player2, time);
			if (time <= 0) {
				this.ball?.launchBall();
				this.map?.start();
				if (this.countdownIntervalId) {
					clearInterval(this.countdownIntervalId);
					this.countdownIntervalId = null;
				}
			}
			time--;
		}, 1000);
		return countdownIntervalId;
	}

	setEnvironnement(scene: babylon.Scene, settings: GameSettings, score: babylon.Vector2): void { /** @todo remove score */
		if (this.doesGameEnded())
			return;
		const player1 = this.getPlayer(1);
		const player2 = this.getPlayer(2);
		if (!player1 || !player2)
			return;
		this.createBall(scene, settings);
		this.createMap(scene, settings);
		this.countdownIntervalId = this.startCountdown(START_TIMEOUT);
		this.engine.getDeltaTime = this.originalGetDelta;
		this.sendDeltaTime(player1, player2, this.engine.getDeltaTime());
	}

	destroyEnvironnement(scene: babylon.Scene): void { /** @todo remove scene */
		// this.allowReceiving = false;
		this.players.forEach((player) => {
			player.clearControls();
		});
		this.destroyBall();
		this.destroyMap();
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
		this.gameStopped = true;
		this.destroyPlayers();
		if (this.countdownIntervalId)
			clearInterval(this.countdownIntervalId);
		this.destroyEnvironnement(scene);
	}
}

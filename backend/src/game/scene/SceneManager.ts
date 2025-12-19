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
import { GameSettings } from "../settings/GameSettings.js";
import { MAP_SIZE, PLAYER_DIMENSION, START_TIMEOUT, WALL_WIDTH } from "../settings/values.js";
import { WebSocket } from "ws";
import { BallOption, MapOption, PlanePosition, Position, RenderMessage, Status, TimingMessage, EmoteMessage, EmoteChoice } from "../../../shared/types_transfert.js";
import { Human } from "../player/Human.js";
import { EnvironmentManager } from "../map/map_utils/EnvironmentManager.js";
import { AI } from "../player/AI.js";

class SceneManager {
	private ball: BallTemplate | null = null;
	private map: MapTemplate | null = null;
	private readonly players: Player[] = [];
	private countdownIntervalId: ReturnType<typeof setInterval> | null = null;
	private gameStopped = false;
	private readonly sceneObservable: babylon.Observable<babylon.Scene>;
	private readonly sceneObserver: babylon.Observer<babylon.Scene>;
	private readonly environmentManager: EnvironmentManager;
	private sockets: WebSocket[] = [];

	constructor(scene: babylon.Scene, settings: GameSettings) {
		this.sockets.push(settings.player1.socket);
		if (settings.player2) // non AI
			this.sockets.push(settings.player2.socket);
		this.environmentManager = new EnvironmentManager(scene, this.sockets, settings);
		this.sceneObservable = scene.onBeforeRenderObservable;
		this.sceneObserver = this.observeScene(scene, settings);
	}

	private observeScene(scene: babylon.Scene, settings: GameSettings): babylon.Observer<babylon.Scene> {
		const sceneObserver = this.sceneObservable.add(() => {
			if (this.checkOutOfFieldBall(this.ball?.getPosition())) {
				this.gameStopped = true;
				this.ball?.stop();
				this.ball?.reset();
				this.map?.stop();
				this.environmentManager.pauseSpawn();
				this.environmentManager.clearObjects();
				this.countdownIntervalId = this.startCountdown(scene, START_TIMEOUT, settings);
			}
			this.checkPlayerEmote();
		});
		return sceneObserver;
	}

	startCountdown(scene: babylon.Scene, time: number, settings: GameSettings): ReturnType<typeof setInterval> {
		const countdownIntervalId = setInterval(() => {
			const player1 = this.getPlayer(1);
			const player2 = this.getPlayer(2);
			if (!player1 || !player2)
				return;
			this.sendCountDown(player1, player2, time);
			if (time <= 0) {
				let startingDirection;
				if (!settings.options.rotatingPlayer && !settings.options.spin)
					startingDirection = new babylon.Vector3((Math.random() - 0.5) * 2, 0, (Math.random() - 0.5));
				this.ball?.launchBall(undefined, startingDirection);
				this.ball?.start();
				if (this.map) {
					this.map?.start();
					this.environmentManager.initObjectsParameters(scene, this.map.getAvailableObjects(), this.map.getWind());
					this.environmentManager.startSpawn();
				}
				if (player2 instanceof AI)
					player2.update();
				if (this.countdownIntervalId) {
					this.gameStopped = false;
					clearInterval(this.countdownIntervalId);
					this.countdownIntervalId = null;
				}
			}
			time--;
		}, 1000);
		return countdownIntervalId;
	}

	private checkPlayerEmote(): void {
		this.players.forEach(player => {
			const emote: EmoteChoice | undefined = player.getEmote();
			if (emote !== undefined) {
				this.sockets.forEach(socket => {
					const infos: EmoteMessage = {
						status: Status.EMOTE,
						type: emote,
						playerid: player.getId()
					};
		
					socket.send(JSON.stringify(infos));
				});
			}
			player.resetEmote();
		});
	}

	private checkOutOfFieldBall(position: Position | undefined): boolean {
		if (!position)
			return false;
		if (position.x > MAP_SIZE.x / 2 + WALL_WIDTH / 2
		|| position.x < -(MAP_SIZE.x / 2 + WALL_WIDTH / 2)
		|| position.z > MAP_SIZE.z / 2 + WALL_WIDTH / 2
		|| position.z < -(MAP_SIZE.z / 2 + WALL_WIDTH / 2)) {
			return true;
		}
		return false;
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
		let ball: BallOption;
		if (settings.options.ball.length)
			ball = settings.options.ball[Math.floor(Math.random() * settings.options.ball.length)];
		else
			ball = "default";
		switch (ball) {
			case "default":
				this.ball = new DefaultBall(scene, this.sockets, settings);
				break;
			case "invisible":
				this.ball = new InvisibleBall(scene, this.sockets, settings);
				break;
			case "tricky":
				this.ball = new TrickyBall(scene, this.sockets, settings);
				break;
			case "pulse":
				this.ball = new PulseBall(scene, this.sockets, settings);
				break;
			case "snake":
				this.ball = new SnakeBall(scene, this.sockets, settings);
				break;
			default: 
				throw new Error("switch ball fail");
		}
	}

	private createMap(scene: babylon.Scene, settings: GameSettings): void {
		let map: MapOption;
		if (settings.options.map.length)
			map = settings.options.map[Math.floor(Math.random() * settings.options.map.length)];
		else
			map = "default";
		switch (map) {
			case "default":
				this.map = new DefaultMap(scene, settings.options.canonCount);
				break;
			case "volcano":
				this.map = new VolcanoMap(scene, settings.options.canonCount);
				break;
			case "sky":
				this.map = new SkyMap(scene, settings.options.canonCount);
				break;
			case "desert":
				this.map = new DesertMap(scene, settings.options.canonCount);
				break;
			default:
				throw new Error("switch map fail");
		}
	}

	createPlayers(scene: babylon.Scene, settings: GameSettings): void {
		const player1PosX = MAP_SIZE.x / 2 - (PLAYER_DIMENSION.z + WALL_WIDTH);
		const player2PosX = (PLAYER_DIMENSION.z + WALL_WIDTH) -(MAP_SIZE.x / 2);
		const playersPoxY = PLAYER_DIMENSION.y / 2;
		const player1 = new Human(scene, new babylon.Vector2(player1PosX, playersPoxY), settings.options, settings.player1);
		let player2;
		if (settings.player2)
			player2 = new Human(scene, new babylon.Vector2(player2PosX, playersPoxY), settings.options, settings.player2);
		else
			player2 = new AI(scene, new babylon.Vector2(player2PosX, playersPoxY), settings.options);
		this.players.push(player1);
		this.players.push(player2);
	}

	checkGoal(): "player1" | "player2" | null {
		const goalInfos = this.ball?.getGoal();
		if (goalInfos)
			return goalInfos;
		return null;
	}

	/** ball explodes, the time slow down */
	async goalAnimation(): Promise<void> {
		if (this.map)
			this.map.stop();
		this.destroyBall();
		const player1 = this.getPlayer(1);
		const player2 = this.getPlayer(2);
		if (!player1 || !player2)
			return;
		this.sendDeltaTime(player1, player2, 0.1);
		await new Promise<void>(resolve => setTimeout(
			() => resolve(), 2700
		));
	}

	private sendDeltaTime(player1: Player, player2: Player, deltaTime: number): void {
		const time: RenderMessage = {
			status: Status.RENDER,
			deltaMultiplicator : deltaTime
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

	setEnvironnement(scene: babylon.Scene, settings: GameSettings): void {
		const player1 = this.getPlayer(1);
		const player2 = this.getPlayer(2);
		if (!player1 || !player2)
			return;
		this.createBall(scene, settings);
		if (player2 instanceof AI && this.ball) {
			player2.setBallToWatch(this.ball);
		}
		this.createMap(scene, settings);
		this.countdownIntervalId = this.startCountdown(scene, START_TIMEOUT, settings);
		this.sendDeltaTime(player1, player2, 1);
	}

	destroyEnvironnement(): void {
		this.players.forEach((player) => player.clearControls());
		this.environmentManager.pauseSpawn();
		this.environmentManager.clearObjects();
		this.destroyBall();
		this.destroyMap();
	}

	/** debug function */
	showDisposeLogs(scene: babylon.Scene): void {
		console.log("meshes : " + scene.meshes);
		console.log("materials : " + scene.materials);
		scene.materials.forEach(mat =>
			console.log("mat name : " + mat.name)
		);
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

	destroyScene(): void {
		this.gameStopped = true;
		this.environmentManager.destroy();
		this.destroyPlayers();
		if (this.countdownIntervalId)
			clearInterval(this.countdownIntervalId);
		this.sceneObservable.remove(this.sceneObserver);
		this.destroyEnvironnement();
	}
}

export { SceneManager };

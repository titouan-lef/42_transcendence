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
import { RainyMap as SkyMap } from "../map/SkyMap.js";
import { DesertMap } from "../map/DesertMap.js";
import { VolcanoMap } from "../map/VolcanoMap.js";
import { Player } from "../player/Player.js";
import { BallOption, GameSettings, MapOption } from "../settings/GameSettings.js";
import { MAP_SIZE, PLAYER_DIMENSION, POINTS_TO_WIN, START_TIMEOUT, WALL_WIDTH } from "../settings/values.js";
import { CountDown } from "./CountDown.js";
import { DataMessage, GoalMessage, Object, ObjectMessage, PositionsMessage, Status } from "../types_transfert.js";

export class SceneManager {
	private ball: BallTemplate | null = null;
	private map: MapTemplate | null = null;
	private countDown: CountDown | null = null;
	private readonly socket: WebSocket;
	private readonly scene: babylon.Scene;
	private readonly players: Player[] = [];
	private readonly textures: Record<string, babylon.Texture> = {};
	private score: Score;

	constructor(socket: WebSocket, scene: babylon.Scene, camera: babylon.ArcRotateCamera, settings: GameSettings) {
		this.socket = socket;
		this.scene = scene;
		this.score = new Score(scene, camera);

		socket.addEventListener("message", (event) => { /** @todo check if removeEventListener is necesseray and the end of the game */
			const message : DataMessage = JSON.parse(event.data);
			switch (message.status) {
				case (Status.TIMING):
					this.setCountDown(message.time);
					break;
				case (Status.GOAL):
					this.setGoalCheck(message, settings);
					break;
				case (Status.POSITIONS):
					this.setPositionUpdater(message);
					break;
				default:
					return; /** do nothing / not an error*/
			}
		});
	}

	getBall(): BallTemplate | null {
		return this.ball;
	}

	getPlayer(number: number): Player | undefined {
		const player = this.players.find(
			(p) => p.getId() === number
		);
		return player;
	}

	private createBall(scene: babylon.Scene, ballType: BallOption): void {
		const ball = ballType; // no random in the front
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
			default: 
				throw new Error("switch ball fail");
		}
	}

	private createMap(scene: babylon.Scene, map: MapOption): void {
		switch (map) {
			case "default":
				this.map = new DefaultMap(scene, this.textures.stars);
				break;
			case "volcano":
				this.map = new VolcanoMap(scene, this.textures);
				break;
			case "sky":
				this.map = new SkyMap(scene, this.textures);
				break;
			case "desert":
				const windForce = new babylon.Vector3(0, 0, 0); /** @todo get windForce from back ? */
				this.map = new DesertMap(scene, this.textures, windForce);
				break;
			default: 
				throw new Error("switch map fail");
		}
	}

	updateObject(scene: babylon.Scene, object: ObjectMessage): void {
		switch (object.type) {
			case (Object.LIGHTNING):
				this.map?.handleObject(scene, this.textures.spark, object);
				break;
			case (Object.METEOR):
				this.map?.handleObject(scene, this.textures.flare, object);
				break;
			case (Object.TORNADO):
				this.map?.handleObject(scene, this.textures.flare, object);
				break;
			default:
				return;
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

	createTextures(scene: babylon.Scene): void { /** @todo check if one request per texture is best practice. Do we need al texture for all the maps ??*/
		this.textures.spark = new babylon.Texture("textures/sparks.png", scene, true);
		this.textures.flare = new babylon.Texture("textures/flare.png", scene, true);
		this.textures.stars = new babylon.Texture("textures/particle.png", scene, true);
		this.textures.rain = new babylon.Texture("textures/rain.png", scene, true);
		this.textures.smoke = new babylon.Texture("textures/smoke.png", scene, true);
		this.textures.electricity = new babylon.Texture("textures/electricity.png", scene, true);
	}

	/** ball explodes, the time slow down */
	async goalAnimation(engine: babylon.Engine, scene: babylon.Scene, position: babylon.Vector3, score: babylon.Vector2): Promise<void> {
		if (this.map)
			this.map.predeath();
		this.ball?.preDeath();
		this.ball?.showParticles(position, scene, "explosion");
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

	private setCountDown(time: number): void {
		this.countDown = this.countDown?.udpateCountDown(time) || null;
	}

	private setGoalCheck(message: GoalMessage, settings: GameSettings): void {
		this.destroyEnvironnement(new babylon.Vector2(message.player, message.enemy));
		if (message.player !== POINTS_TO_WIN && message.enemy !== POINTS_TO_WIN)
			this.setEnvironnement(this.scene, settings);
		/** @todo review manegement of this, maebe it should be handle int he Game ?? */
		/** @todo animation win / loose */
	}

	private setPositionUpdater(message : PositionsMessage): void {
		this.getPlayer(1)?.setPosition(message.player);
		this.getPlayer(1)?.setRotatiton(message.playerRotation);
		this.getPlayer(2)?.setPosition(message.enemy);
		this.getPlayer(2)?.setRotatiton(message.enemyRotation);
		this.ball?.setPosition(message.ball);
	}
 
	setEnvironnement(scene: babylon.Scene, settings: GameSettings): void {
		this.createBall(scene, settings.ball);
		this.createMap(scene, settings.map);
		this.countDown = new CountDown(this.scene);
	}

	destroyEnvironnement(score: babylon.Vector2 | null): void {
		this.destroyCountDown();
		this.destroyBall();
		this.destroyMap();
		if (score)
			this.score.changeScore([score.x, score.y]);
		// this.ball = null; // repetition
		// this.map = null;
		// while(this.players.length > 0) { //maybe needed but somwhere else
		// 	this.players.pop();
		// }
	}

	/** debug function */
	showDisposeLogs(scene: babylon.Scene): void {
		console.log("meshes : " + scene.meshes);
		console.log("materials : " + scene.materials);
		scene.materials.forEach(mat => {
			console.log("mat name : " + mat.name);
		});
		console.log("textures : " + scene.textures);
		scene.textures.forEach(texture => {
			console.log("texture name : " + texture.name);
		});
		console.log("lights : " + scene.lights);
		console.log("particle system: " + scene.particleSystems);
	}

	clearObjects():void {
		this.map?.destroyRest();
	}

	private destroyBall(): void {
		this.ball?.destroy();
		this.ball = null;
	}

	private destroyMap(): void  {
		this.map?.destroy();
		this.map = null;
	}

	private destroyPlayers(): void {
		this.players.forEach(player => player.destroy());
	}

	private destroyCountDown(): void {
		this.countDown?.destroy();
		this.countDown = null;
	}

	private destroyTextures(): void {
		for (const texture in this.textures) {
			this.textures[texture].dispose();
		}
	}

	private destroyScore(): void {
		this.score.destroy();
	}

	destroyScene(): void {
		this.destroyTextures();
		this.destroyPlayers();
		this.destroyEnvironnement(null);
		this.destroyScore();
	}
}

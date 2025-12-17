import * as babylon from "@babylonjs/core";
import { Ball } from "../ball/Ball.js";
import { Score } from "./Score.js";
import { MapTemplate } from "../map/MapTemplate.js";
import { DefaultMap } from "../map/DefaultMap.js";
import { SkyMap } from "../map/SkyMap.js";
import { DesertMap } from "../map/DesertMap.js";
import { VolcanoMap } from "../map/VolcanoMap.js";
import { Player } from "../player/Player.js";
import { BallOption, PointSettings, MapOption } from "../settings/PointSettings.js";
import { COLORS3, MAP_SIZE, PLAYER_DIMENSION, WALL_WIDTH } from "../settings/values.js";
import { CountDown } from "./CountDown.js";
import { DataMessage, EventMessage, EmoteMessage, PlanePosition, PositionsMessage, Status } from "../types_transfert.js";
import { EnvironmentManager } from "../map/map_utils/EnvironmentManager.js";
import { ParticuleManager as ParticleManager } from "./ParticuleManager.js";

class SceneManager {
	private ball: Ball | null = null;
	private map: MapTemplate | null = null;
	private countDown: CountDown | null = null;
	private readonly scene: babylon.Scene;
	private readonly players: Player[] = [];
	private readonly textures: Record<string, babylon.Texture> = {};
	private score: Score;
	private readonly environnementManager: EnvironmentManager;
	private readonly particleManager: ParticleManager;
	private texturesCreated = false;

	constructor(scene: babylon.Scene, camera: babylon.ArcRotateCamera, settings: PointSettings) {
		this.scene = scene;
		this.score = new Score(scene, camera);
		this.environnementManager = new EnvironmentManager();
		this.createTextures(scene);
		this.particleManager = new ParticleManager(this.textures);

		settings.player1.socket?.addEventListener("message", (event) => {
			const message : DataMessage = JSON.parse(event.data);
			switch (message.status) {
				case (Status.TIMING):
					if (!this.countDown)
						this.countDown = new CountDown(this.scene);
					this.setCountDown(message.time);
					break;
				case (Status.GOAL):
					this.destroyEnvironnement(new babylon.Vector2(message.player, message.enemy));
					break;
				case (Status.POSITIONS):
					this.setPositionUpdater(message);
					break;
				case (Status.EVENT):
					this.handleParticules(message);
					break;
				case (Status.OBJECT):
					this.environnementManager.handleObject(scene, this.textures, message);
					break;
				case (Status.OBJECTSPAWNER):
					this.environnementManager.handleObjectSpawner(scene, message);
					break;
				case (Status.EMOTE):
					this.sendEmote(settings, scene, message);
					break;
				default:
					return; /** do nothing / not an error*/
			}
		});
	}

	getBall(): Ball | null {
		return this.ball;
	}

	getPlayer(number: number): Player | undefined {
		const player = this.players.find(
			(p) => p.getId() === number
		);
		return player;
	}

	private createBall(scene: babylon.Scene, ballType: BallOption): void {
		let color;
		switch (ballType) {
			case "invisible":
				color = COLORS3.red;
				break;
			case "tricky":
				color = COLORS3.orange;
				break;
			case "pulse":
				color = COLORS3.blue;
				break;
			case "snake":
				color = COLORS3.green;
				break;
			case "default":
				color = COLORS3.white;
				break;
			default:
				color = COLORS3.black;
				break;
		}
		this.ball = new Ball(scene, ballType, color);
	}

	private createMap(scene: babylon.Scene, map: MapOption, wind: PlanePosition): void {
		switch (map) {
			case "default":
				this.map = new DefaultMap(scene, this.textures.stars, wind);
				break;
			case "volcano":
				this.map = new VolcanoMap(scene, this.textures, wind);
				break;
			case "sky":
				this.map = new SkyMap(scene, this.textures, wind);
				break;
			case "desert":
				this.map = new DesertMap(scene, this.textures, wind);
				break;
			default: 
				throw new Error("switch map fail");
		}
	}

	createPlayers(scene: babylon.Scene, settings: PointSettings): void {
		const player1PosX = MAP_SIZE.x / 2 - (PLAYER_DIMENSION.z + WALL_WIDTH);
		const player2PosX = (PLAYER_DIMENSION.z + WALL_WIDTH) -(MAP_SIZE.x / 2);
		const playersPoxY = PLAYER_DIMENSION.y / 2;
		const player1 = new Player(scene, new babylon.Vector2(player1PosX, playersPoxY), settings, settings.player1);
		const player2 = new Player(scene, new babylon.Vector2(player2PosX, playersPoxY), settings, settings.player2);
		this.players.push(player1);
		this.players.push(player2);
	}

	private createTextures(scene: babylon.Scene): void {
		this.textures.spark = new babylon.Texture("textures/sparks.png", scene, true);
		this.textures.flare = new babylon.Texture("textures/flare.png", scene, true);
		this.textures.stars = new babylon.Texture("textures/particle.png", scene, true);
		this.textures.rain = new babylon.Texture("textures/rain.png", scene, true);
		this.textures.smoke = new babylon.Texture("textures/smoke.png", scene, true);
		this.textures.electricity = new babylon.Texture("textures/electricity.png", scene, true);
		this.textures.emoteStrong = new babylon.Texture("textures/emotes/strong.png", scene, true);
		this.textures.emoteSad = new babylon.Texture("textures/emotes/sad.png", scene, true);
		this.textures.emoteLol = new babylon.Texture("textures/emotes/lol.png", scene, true);
		this.textures.emoteAngry = new babylon.Texture("textures/emotes/angry.png", scene, true);
		this.textures.stun = new babylon.Texture("textures/stun.png", scene, true);
		this.texturesCreated = true;
	}

	private handleParticules(message: EventMessage): void {
		this.particleManager.showParticles(message.position, this.scene, message);
	}

	private setCountDown(time: number): void {
		this.countDown = this.countDown?.udpateCountDown(time) || null;
	}

	private setPositionUpdater(message : PositionsMessage): void {
		this.getPlayer(1)?.setPosition(message.player);
		this.getPlayer(1)?.setRotatiton(message.playerRotation);
		this.getPlayer(1)?.setStunAnim(message.playerStunned, this.textures.stun);
		this.getPlayer(2)?.setPosition(message.enemy);
		this.getPlayer(2)?.setRotatiton(message.enemyRotation);
		this.getPlayer(2)?.setStunAnim(message.enemyStunned, this.textures.stun);
		this.ball?.setPosition(message.ball);
		this.ball?.setVisibility(message.ballVisibility);
	}

	/**@todo Clarify Id in the front VS playerId back */
	private sendEmote(settings: PointSettings, scene: babylon.Scene, message: EmoteMessage): void {
		this.players.forEach(player => {
			if (settings.player1.playerId === 1) {
				if (this.texturesCreated && message.playerid === player.getId())
					player.popEmote(scene, message, this.textures);
			} else {
				if (this.texturesCreated && message.playerid !== player.getId())
					player.popEmote(scene, message, this.textures);
			}
		});
	}
 
	setEnvironnement(scene: babylon.Scene, settings: PointSettings): void {
		this.particleManager.clear();
		this.createBall(scene, settings.ball);
		this.createMap(scene, settings.map, settings.wind);
		this.environnementManager.clear();
	}

	destroyEnvironnement(score: babylon.Vector2 | null): void {
		this.destroyCountDown();
		this.destroyBall();
		this.destroyMap();
		if (score)
			this.score.changeScore([score.x, score.y]);
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

export { SceneManager };

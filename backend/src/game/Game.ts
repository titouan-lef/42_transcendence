import * as babylon from "@babylonjs/core";
import { SceneManager } from "./scene/SceneManager.js";
import { GameSettings } from "./settings/GameSettings.js";
import { HavokPlugin } from "@babylonjs/core/Physics/index.js";
import havokPhysics from "@babylonjs/havok";
import { POINTS_TO_WIN, SHOW_DISPOSE_LOGS } from "./settings/values.js";
import fs from "fs";
import { Status, PlayerControls, PositionsMessage, StartMessage, StopMessage, OptionMessage, GoalMessage } from "../web_sockets/types_transfert.js";
import { Player } from "./player/Player.js";
import { Human } from "./player/Human.js";

class Game {
	private readonly engine: babylon.Engine;
	private readonly scene: babylon.Scene;
	private readonly sceneManager: SceneManager;
	private readonly settings: GameSettings;
	private readonly camera: babylon.ArcRotateCamera; // the engine need a camera
	private gameInterval?: ReturnType<typeof setInterval>; /** @todo type is supposed to be NodeJS.Timer but does not work */
	private score: babylon.Vector2;
	private inAnimation = false;

	constructor (settings: GameSettings, scene: babylon.Scene, engine: babylon.Engine) {
		this.engine = engine;
		this.settings = settings;
		this.camera = new babylon.ArcRotateCamera("Camera", 0, 0, 0, babylon.Vector3.Zero(), scene);
		this.sceneManager = new SceneManager(engine);
		this.scene = scene;
		this.score = new babylon.Vector2(0, 0);
		this.setScene();
	}

	/** returning the constructor because we cant do an async constructor and create() will have to wait for havok.engine to start */
	static async create(settings: GameSettings): Promise<Game> {
		const engine =  new babylon.NullEngine();
		const scene = await Game.initScene(engine);
		return new Game(settings, scene, engine);
	}

	private static async initScene(engine: babylon.Engine): Promise<babylon.Scene> {
		const scene = new babylon.Scene(engine);
		const nodeBuffer = fs.readFileSync("/app/node_modules/@babylonjs/havok/lib/esm/HavokPhysics.wasm");
		const wasmBinary = nodeBuffer.buffer.slice(nodeBuffer.byteOffset, nodeBuffer.byteOffset + nodeBuffer.byteLength);
		const havokInstance = await havokPhysics({ wasmBinary });
		const havokPlugin = new HavokPlugin(true, havokInstance);
		scene.enablePhysics(new babylon.Vector3(0, -9.81, 0), havokPlugin);
		return scene;
	};

	start(): void {
		this.engine.runRenderLoop(() => {
			this.scene.render();
		});
		this.startGameCommunication();
	}

	/**@todo usefull ? */
	hide(): void {
		this.engine.stopRenderLoop();
	}

	stop(): void {
		this.stopSendingPositions();
		this.sceneManager.destroyScene(this.scene);
		this.scene.onAfterRenderObservable.clear();
		this.camera.dispose();
		if (SHOW_DISPOSE_LOGS)
			this.sceneManager.showDisposeLogs(this.scene);
		this.engine.stopRenderLoop();
		this.scene.dispose();
		this.engine.dispose();
		babylon.Tools.ClearLogCache(); // hides previous logs 
	}

	private setScene(): void {
		this.sceneManager.createPlayers(this.scene, this.settings);
		this.sceneManager.setEnvironnement(this.scene, this.settings, this.score);
		this.scene.onAfterRenderObservable.add(() => {
			if (this.inAnimation === false)
				this.checkEndOfPoint();
		});
	}

	/**check collision for each balls */
	async checkEndOfPoint(): Promise<void> {
		const goalInfos = this.sceneManager.checkGoal();
		if (goalInfos !== null && goalInfos.position !== null) {
			this.inAnimation = true;
			goalInfos.goal === "player1" ? this.score.x += 1 : this.score.y += 1;
			await this.sceneManager.goalAnimation(goalInfos.position);
			this.sendScore();
			if (this.sceneManager.doesGameEnded()) // if closing game while animation
				return;
			if (this.score.x === POINTS_TO_WIN || this.score.y === POINTS_TO_WIN) {
				this.stop();
			} else {
				this.inAnimation = false;
				this.sceneManager.destroyEnvironnement(this.scene);
				if (SHOW_DISPOSE_LOGS)
					this.sceneManager.showDisposeLogs(this.scene);
				this.sceneManager.setEnvironnement(this.scene, this.settings, this.score);
				const player1 = this.sceneManager.getPlayer(1);
				const player2 = this.sceneManager.getPlayer(2);
				if (!player1 || !player2)
					return;
				this.sendOptions(player1, player2);
			}
		}
	}

	private getPositions(player: Player, enemy: Player): PositionsMessage | null {
		const ball = this.sceneManager.getBall();
		if (!ball)
			return null;

		const positions: PositionsMessage = {
			status: Status.POSITIONS,
			ball: ball.getPosition(),
			ballVisibility: ball.getVisibility(),
			player: player.getPosition(),
			playerRotation: player.getRotation(),
			enemy: enemy.getPosition(),
			enemyRotation: enemy.getRotation()
		};
		return positions;
	}

	private async sendPositions(player1: Player, player2: Player) : Promise<void> {
		const positionP1 = this.getPositions(player1, player2);
		if (positionP1)
			player1.send(positionP1);
		const positionP2 = this.getPositions(player2, player1);
		if (positionP2)
			player2.send(positionP2);
	}

	private async sendStart(player1: Player, player2: Player) : Promise<void> {
		const startP1: StartMessage = {
			status: Status.START,
			playerName: player1.getName(),
			enemyName: player2.getName()
		};
		player1.send(startP1);
		const startP2: StartMessage = {
			status: Status.START,
			playerName: player2.getName(),
			enemyName: player1.getName()
		};
		player2.send(startP2);
	}

	private async sendStop(player1: Player, player2: Player) : Promise<void> {
		const stop: StopMessage = {
			status: Status.STOP,
		};
		player1.send(stop);
		player2.send(stop);
	}

	private async sendOptions(player1: Player, player2: Player) : Promise<void> {
		const options: OptionMessage = {
			status: Status.OPTIONS,
			playerId: 1,
			map: this.sceneManager.getMapType(),
			wind: this.sceneManager.getWind(),
			ball: "default",
			rotatingPlayer: this.settings.rotatingPlayer,
			spin: this.settings.spin
		};

		const ball = this.sceneManager.getBall();
		if (ball)
			options.ball = ball.getType();

		player1.send(options);
		options.playerId = 2;
		player2.send(options);
	}

	private async sendScore() : Promise<void> {
		const player1 = this.sceneManager.getPlayer(1);
		const player2 = this.sceneManager.getPlayer(2);
		if (!player1 || !player2)
			return;

		const scoreP1: GoalMessage = {
			status: Status.GOAL,
			player: this.score.x,
			enemy: this.score.y
		};
		player1.send(scoreP1);
		const scoreP2: GoalMessage = {
			status: Status.GOAL,
			player: this.score.y,
			enemy: this.score.x
		};
		player2.send(scoreP2);
	}

	startSendingPositions(): void {
		const intervalMs = 1000 / 60; // 60 fps

		this.gameInterval = setInterval(() => {
			const player1 = this.sceneManager.getPlayer(1);
			const player2 = this.sceneManager.getPlayer(2);
			if (!player1 || !player2)
				return;
			this.sendPositions(player1, player2);
		}, intervalMs);
	}

	startGameCommunication(): void {
		const player1 = this.sceneManager.getPlayer(1);
		const player2 = this.sceneManager.getPlayer(2);
		if (!player1 || !player2)
			return;
		this.sendStart(player1, player2);
		this.sendOptions(player1, player2);
		this.sendPositions(player1, player2);
		this.startSendingPositions();

		if (player1 instanceof Human) {
			player1.defineCloseAction(() => {
				this.stop();
				if (player2 instanceof Human) 
					player2.closeSocket();
			});
		}
		if (player2 instanceof Human) {
			player2.defineCloseAction(() => {
				this.stop();
				if (player1 instanceof Human) 
					player1.closeSocket();
			});
		}
	}

	stopSendingPositions(): void {
		if (!this.gameInterval)
			return;
		clearInterval(this.gameInterval);
		this.gameInterval = undefined;

		const player1 = this.sceneManager.getPlayer(1);
		const player2 = this.sceneManager.getPlayer(2);
		if (!player1 || !player2)
			return;
		this.sendStop(player1, player2);
	}
}

export { Game };

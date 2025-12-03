import * as babylon from "@babylonjs/core";
import { SceneManager } from "./scene/SceneManager.js";
import { GameSettings } from "./settings/GameSettings.js";
import { HavokPlugin } from "@babylonjs/core/Physics/index.js";
import havokPhysics from "@babylonjs/havok";
import { GAME_STEP_INTERVAL, PHYSIC_STEP_INTERVAL, POINTS_TO_WIN, SHOW_DISPOSE_LOGS } from "./settings/values.js";
import fs from "fs";
import { Status, PositionsMessage, StartMessage, StopMessage, OptionMessage, GoalMessage } from "./web_sockets/types_transfert.js";
import { Player } from "./player/Player.js";
import { Human } from "./player/Human.js";
import { stopGame } from "./game_manager.js";

class Game {
	private readonly id: number;
	private readonly engine: babylon.Engine;
	private readonly scene: babylon.Scene;
	private readonly sceneManager: SceneManager;
	private readonly settings: GameSettings;
	private readonly camera: babylon.ArcRotateCamera; // the engine need a camera
	private gameStepsIntervalId?: ReturnType<typeof setInterval>; /** @todo type is supposed to be NodeJS.Timer but does not work */
	private gameStepsInterval = GAME_STEP_INTERVAL;
	private physicStepsInterval = PHYSIC_STEP_INTERVAL;
	private inAnimation = false;
	private score: babylon.Vector2;

	constructor (id: number, settings: GameSettings, scene: babylon.Scene, engine: babylon.Engine) {
		this.id = id;
		this.engine = engine;
		this.settings = settings;
		this.camera = new babylon.ArcRotateCamera("Camera", 0, 0, 0, babylon.Vector3.Zero(), scene);
		this.sceneManager = new SceneManager(engine, scene, settings);
		this.scene = scene;
		this.scene.metadata = { gameSpeed: 1 };
		this.score = new babylon.Vector2(0, 0);
		this.setScene();
	}

	/** returning the constructor because we cant do an async constructor and create() will have to wait for havok.engine to start */
	static async create(id: number, settings: GameSettings): Promise<Game> {
		const engine =  new babylon.NullEngine();
		const scene = await Game.initScene(engine);
		return new Game(id, settings, scene, engine);
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
		this.startGameCommunication();
	}

	/**@todo usefull ? */
	pause(): void {
		if (this.gameStepsIntervalId)
			clearInterval(this.gameStepsIntervalId);
	}

	stop(): void {
		this.stopSendingPositions();
		this.sceneManager.destroyScene();
		this.scene.onAfterRenderObservable.clear();
		this.camera.dispose();
		if (SHOW_DISPOSE_LOGS)
			this.sceneManager.showDisposeLogs(this.scene);
		//this.engine.stopRenderLoop();
		this.scene.dispose();
		this.engine.dispose();
	}

	private setScene(): void {
		this.sceneManager.createPlayers(this.scene, this.settings);
		this.sceneManager.setEnvironnement(this.scene, this.settings);
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
			this.changeGameSpeed(0.1);
			await this.sceneManager.goalAnimation(goalInfos.position);
			if (this.sceneManager.doesGameEnded()) // if closing game while animation
				return;
			this.changeGameSpeed(1);
			this.sendScore();
			if (this.score.x === POINTS_TO_WIN || this.score.y === POINTS_TO_WIN) {
				stopGame(this.id);
			} else {
				this.inAnimation = false;
				this.sceneManager.destroyEnvironnement();
				if (SHOW_DISPOSE_LOGS)
					this.sceneManager.showDisposeLogs(this.scene);
				this.sceneManager.setEnvironnement(this.scene, this.settings);
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
		let ballPosition;
		let ballVisibility;
		if (!ball) {
			ballPosition = { x: 0, y:0, z: 0 };
			ballVisibility = 0;
		} else{
			ballPosition = ball.getPosition();
			ballVisibility = ball.getVisibility();
		}

		const positions: PositionsMessage = {
			status: Status.POSITIONS,
			ball: ballPosition,
			ballVisibility: ballVisibility,
			player: player.getPosition(),
			playerRotation: player.getRotation(),
			playerStunned: player.getState(),
			enemy: enemy.getPosition(),
			enemyRotation: enemy.getRotation(),
			enemyStunned: enemy.getState(),
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
			rotatingPlayer: this.settings.options.rotatingPlayer,
			spin: this.settings.options.spin,
			canonCount: this.settings.options.canonCount
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

	private changeGameSpeed(newSpeed: number): void {
		this.scene.metadata.gameSpeed = newSpeed;
	}

	startRender(): void {
		this.gameStepsIntervalId = setInterval(() => {
			const physics = this.scene.getPhysicsEngine();
			if (physics)
				physics._step(this.physicStepsInterval / 1000 * this.scene.metadata.gameSpeed);
			this.scene.render();

			const player1 = this.sceneManager.getPlayer(1);
			const player2 = this.sceneManager.getPlayer(2);
			if (!player1 || !player2)
				return;
			this.sendPositions(player1, player2);
		}, this.gameStepsInterval);
	}

	private defineCloseAction(player: Player, enemy: Player): void {
		if (player instanceof Human) {
			player.defineCloseAction(() => {
				stopGame(this.id);
				if (enemy instanceof Human)
					enemy.closeSocket();
			});
		}
	}

	startGameCommunication(): void {
		this.startRender();
		const player1 = this.sceneManager.getPlayer(1);
		const player2 = this.sceneManager.getPlayer(2);
		if (!player1 || !player2)
			return;
		this.sendStart(player1, player2);
		this.sendOptions(player1, player2);
		this.sendPositions(player1, player2);

		this.defineCloseAction(player1, player2);
		this.defineCloseAction(player2, player1);
	}

	stopSendingPositions(): void {
		if (!this.gameStepsIntervalId)
			return;
		clearInterval(this.gameStepsIntervalId);
		this.gameStepsIntervalId = undefined;

		const player1 = this.sceneManager.getPlayer(1);
		const player2 = this.sceneManager.getPlayer(2);
		if (!player1 || !player2)
			return;
		this.sendStop(player1, player2);
	}
}

export { Game };
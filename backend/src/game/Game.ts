import fs from "fs";
import * as babylon from "@babylonjs/core";
import { SceneManager } from "./SceneManager.js";
import { GameSettings, PlayerSettings } from "./GameSettings.js";
import havokPhysics from "@babylonjs/havok";
import { HavokPlugin } from "@babylonjs/core/Physics/index.js";
import { POINTS_TO_WIN } from "./values.js";
import { GameStatus } from "./data_transfert.js";
import { Player } from "./Player.js";

export class Game {
	
	private readonly scene: babylon.Scene;
	private readonly sceneManager: SceneManager;
	private readonly settings: GameSettings;
	private gameInterval?: ReturnType<typeof setInterval>; // ??NodeJS.Timer;
	private score: babylon.Vector2;

	constructor (settings: GameSettings, scene: babylon.Scene) {
		this.settings = settings;
		this.sceneManager = new SceneManager();
		this.scene = scene;
		// window.addEventListener("resize", () => this.engine.resize());
		this.setScene();
		this.score = new babylon.Vector2(0, 0);
		/** @todo add new game into the DB */
	}

	/** returning the constructor because we cant do an async constructor and create() will have to wait for havok.engine to start */
	static async create(settings: GameSettings): Promise<Game> {
		const scene = await Game.initScene();
		return new Game(settings, scene);
	}

	private static async initScene(): Promise<babylon.Scene> {
		const engine = new babylon.NullEngine();
		const scene = new babylon.Scene(engine);

		const nodeBuffer = fs.readFileSync("/app/node_modules/@babylonjs/havok/lib/esm/HavokPhysics.wasm");
		// convert to ArrayBuffer
		const wasmBinary = nodeBuffer.buffer.slice(nodeBuffer.byteOffset, nodeBuffer.byteOffset + nodeBuffer.byteLength);
		const havokInstance = await havokPhysics({ wasmBinary });
		const havokPlugin = new HavokPlugin(true, havokInstance);
		scene.enablePhysics(new babylon.Vector3(0, -9.81, 0), havokPlugin);
		return scene;
	};

	start(): void {
		/** @todo send data_transfert to both players instead of render*/
		// this.engine.runRenderLoop(() => this.scene.render());
		this.startSendingGameStatus();
	}

	/**@todo usefull ? */
	hide(): void {
		// this.engine.stopRenderLoop();
	}

	stop(): void {
		this.stopSendingGameStatus();
		this.sceneManager.destroyEnvironnement(this.scene);
		// this.engine.stopRenderLoop();
		this.scene.onAfterRenderObservable.clear();
		this.scene.dispose();
	}

	private setScene(): void {
		this.sceneManager.setEnvironnement(this.scene, this.settings);
		/**@todo text GOAL?*/

		/**@todo just to make the ball move, will be removed*/
		const sceneManager = this.sceneManager;
		this.scene.onPointerDown = (): void => {
			sceneManager.getBalls().forEach(ball => {
				ball.testMove();
				ball.setJustCollide();
			});
		};

		this.scene.onAfterRenderObservable.add(() => {
			this.checkEndOfPoint();
		});
	}

	/**check collision for each balls */
	checkEndOfPoint(): void {
		const goal = this.sceneManager.checkGoal();
		if (goal !== null) {
			/**@todo inscrire goal */
			if (goal === "player2") {
				this.score.x += 1;
				//console.log("player 2 goaled");
			} else{
				this.score.y += 1;
				//console.log("player 1 goaled");
			}
			if (this.score.x === POINTS_TO_WIN || this.score.y === POINTS_TO_WIN) {
				this.stop();
			} else{
				this.sceneManager.destroyEnvironnement(this.scene);
				this.sceneManager.setEnvironnement(this.scene, this.settings);
			}
		}
	}

	private getGameStatus(player: Player, enemy: Player): GameStatus {
		const status: GameStatus = {
			status: "pending",
			env: {
				map: this.settings.map,
				ball: this.settings.ball,
				rotatingPlayer: this.settings.rotatingPlayer,
				spin: this.settings.spin
			},
			state: {
				start_time: 0, // request from db
				current_time: Date.now(),
				score: { player: this.score.x, enemy: this.score.y } // wrong, alway the same / needs to differ for each player
			},
			player: {
				pseudo: player.username,
				pos: player.mesh.absolutePosition
			},
			enemy: {
				pseudo: enemy.username,
				pos: enemy.mesh.absolutePosition
			},
			ball: {
				pos: enemy.mesh.absolutePosition /** @todo get ball position */
			}
		};
		return status;
	}

	private async sendGameStatus(player1: Player, player2: Player) : Promise<void> {
		player1.socket.send(JSON.stringify(this.getGameStatus(player1, player2)));
		player2.socket.send(JSON.stringify(this.getGameStatus(player2, player1)));
	}

	startSendingGameStatus(): void {
		const intervalMs = 1000 / 30; // 30 fps

		/** @todo better management of players and ball*/
		const player1 = this.sceneManager.players.at(0);
		const player2 = this.sceneManager.players.at(1);
		if (!player1 || !player2 )
			return;
		player1.socket.send(JSON.stringify({ status: "start" }));
		player2.socket.send(JSON.stringify({ status: "start" }));
		
		this.gameInterval = setInterval(() => {
			this.sendGameStatus(player1, player2);
		}, intervalMs);

		player1.socket.on("close", () => this.stop());
		player2.socket.on("close", () => this.stop());
	}

	stopSendingGameStatus(): void {
		if (this.gameInterval) {
			clearInterval(this.gameInterval);
			this.gameInterval = undefined;

			const player1 = this.sceneManager.players.at(0);
			const player2 = this.sceneManager.players.at(1);
			if (!player1 || !player2 )
				return;
			player1.socket.send(JSON.stringify({ status: "stop" }));
			player2.socket.send(JSON.stringify({ status: "stop" }));
		}
	}
	
}

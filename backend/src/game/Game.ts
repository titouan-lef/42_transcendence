import fs from "fs";
import * as babylon from "@babylonjs/core";
import { SceneManager } from "./SceneManager.js";
import { GameSettings, PlayerSettings } from "./GameSettings.js";
import havokPhysics from "@babylonjs/havok";
import { HavokPlugin } from "@babylonjs/core/Physics/index.js";
import { POINTS_TO_WIN } from "./values.js";
import { GameStatus, PlayerControls } from "./data_transfert.js";
import { Player } from "./Player.js";

export class Game {
	
	private readonly engine: babylon.Engine;
	private readonly scene: babylon.Scene;
	private readonly sceneManager: SceneManager;
	private readonly settings: GameSettings;
	private readonly camera: babylon.ArcRotateCamera;
	private gameInterval?: ReturnType<typeof setInterval>; // ??NodeJS.Timer;
	private score: babylon.Vector2;

	constructor (settings: GameSettings, scene: babylon.Scene, engine: babylon.Engine) {
		this.engine = engine;
		this.settings = settings;
		this.sceneManager = new SceneManager();
		this.scene = scene;
		// window.addEventListener("resize", () => this.engine.resize());
		this.setScene();
		this.camera = new babylon.ArcRotateCamera("Camera", 0, 0, 0, new babylon.Vector3(0, 0, 0), scene);
		this.score = new babylon.Vector2(0, 0);
		/** @todo add new game into the DB */
	}

	/** returning the constructor because we cant do an async constructor and create() will have to wait for havok.engine to start */
	static async create(settings: GameSettings): Promise<Game> {
		const engine = new babylon.NullEngine();
		const scene = await Game.initScene(engine);
		return new Game(settings, scene, engine);
	}

	private static async initScene(engine: babylon.Engine): Promise<babylon.Scene> {
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
		this.engine.runRenderLoop(() => this.scene.render());
		this.startSendingGameStatus();
	}

	/**@todo usefull ? */
	hide(): void {
		this.engine.stopRenderLoop();
	}

	stop(): void {
		this.stopSendingGameStatus();
		this.sceneManager.destroyEnvironnement(this.scene);
		this.engine.stopRenderLoop();
		this.scene.onAfterRenderObservable.clear();
		this.camera.dispose();
		this.scene.dispose();
		this.engine.dispose();
		const player1 = this.sceneManager.players.at(0);
		const player2 = this.sceneManager.players.at(1);
		if (player1)
			player1.socket.close();
		if (player2)
			player2.socket.close();
	}

	private setScene(): void {
		this.sceneManager.setEnvironnement(this.scene, this.settings);
		/**@todo text GOAL?*/

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
			} else {
				this.sceneManager.destroyEnvironnement(this.scene);
				this.sceneManager.setEnvironnement(this.scene, this.settings);
			}
		}
	}

	private getGameStatus(status: string, player: Player, enemy: Player): GameStatus | null {
		const ball = this.sceneManager.getBalls().at(0);
		if (!ball)
			return null;
		const ballPos = ball.mesh.position;
		const playerPos = { x: player.mesh.position.x, y: player.mesh.position.y, z: player.mesh.position.z };
		const enemyPos = { x: enemy.mesh.position.x, y: enemy.mesh.position.y, z: enemy.mesh.position.z };
		if (ballPos === undefined)
			return null;
		if (player.username === this.sceneManager.players.at(1)?.username) {
			ballPos.x = -ballPos.x;
			ballPos.z = -ballPos.z;
			playerPos.x = -playerPos.x;
			playerPos.z = -playerPos.z;
			enemyPos.x = -enemyPos.x;
			enemyPos.z = -enemyPos.z;
		}

		const gameStatus: GameStatus = {
			status: status,
			options: {
				map: this.settings.map,
				ball: ball.type,
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
				pos: playerPos
			},
			enemy: {
				pseudo: enemy.username,
				pos: enemyPos
			},
			ball: {
				pos: { x: ballPos.x, y: ballPos.y, z: ballPos.z }
			}
		};
		return gameStatus;
	}

	private async sendGameStatus(status: string, player1: Player, player2: Player) : Promise<void> {
		let gameStatus: GameStatus | null = null;
		gameStatus = this.getGameStatus(status, player1, player2);
		if (gameStatus)
			player1.socket.send(JSON.stringify(gameStatus));
		gameStatus = this.getGameStatus(status, player2, player1);
		if (gameStatus)
			player2.socket.send(JSON.stringify(gameStatus));
	}

	startSendingGameStatus(): void {
		const intervalMs = 1000 / 30; // 30 fps

		/** @todo better management of players and ball*/
		const player1 = this.sceneManager.players.at(0);
		const player2 = this.sceneManager.players.at(1);
		if (!player1 || !player2 )
			return;
		this.sendGameStatus("start", player1, player2);
		
		this.gameInterval = setInterval(() => {
			const player1 = this.sceneManager.players.at(0);
			const player2 = this.sceneManager.players.at(1);
			if (!player1 || !player2 )
				return;
			this.sendGameStatus("pending", player1, player2);
		}, intervalMs);

		player1.socket.on("close", () => {
			this.stop();
			player2.socket.close();
		});
		player2.socket.on("close", () => {
			this.stop();
			player1.socket.close();
		});
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

	receiveDataFrom(playerName: string, message: string): void {
		const controls: PlayerControls = JSON.parse(message);
		const player = this.sceneManager.players.find(
			(p) => p.username === playerName
		);
		if (!player) {
			console.error(`Player ${playerName} not found`);
			return;
		}
		player.keyPressed[0] = controls.mov_left;
		player.keyPressed[1] = controls.mov_right;
		player.keyPressed[2] = controls.rot_left;
		player.keyPressed[3] = controls.rot_right;
		player.keyPressed[4] = controls.apply_effect;
		player.handleAction();
	}
}

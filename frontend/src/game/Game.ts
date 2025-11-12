import * as babylon from "@babylonjs/core";
import { SceneManager } from "./SceneManager.js";
import { GameSettings } from "./GameSettings.js";
import { MAP_SIZE } from "./values.js";
import { GameStatus, Position } from "./data_transfert.js";

export class Game {
	private readonly socket: WebSocket;
	private readonly engine: babylon.Engine;
	private readonly scene: babylon.Scene;
	readonly sceneManager: SceneManager;
	private readonly settings: GameSettings;
	private readonly camera: babylon.ArcRotateCamera;
	private canvas: HTMLCanvasElement;
	private score: babylon.Vector2;

	constructor (socket: WebSocket, canvas: HTMLCanvasElement, settings: GameSettings, scene: babylon.Scene, engine: babylon.Engine) {
		this.socket = socket;
		this.engine = engine;
		this.canvas = canvas;
		this.settings = settings;
		this.sceneManager = new SceneManager();
		this.scene = scene;
		window.addEventListener("resize", () => this.engine.resize());
		this.setScene();
		this.camera = this.createCamera();
		this.score = new babylon.Vector2(0, 0);
	}

	/** returning the constructor because we cant do an async constructor and create() will have to wait for havok.engine to start */
	static async create(socket: WebSocket, settings: GameSettings): Promise<Game> {
		const canvas = Game.createCanvas();
		const engine = new babylon.Engine(canvas, true);
		const scene = await Game.initScene(engine);
		return new Game(socket, canvas, settings, scene, engine);
	}

	/** creating the canvas here because each time a game is created, a new canvas should also be created */
	private static createCanvas(): HTMLCanvasElement {
		const canvas: HTMLCanvasElement = document.createElement("canvas");
		canvas.style.position = "Absolute";
		canvas.style.top = "10%";
		canvas.style.left = "10%";
		canvas.style.width = "80%";
		canvas.style.height = "80%";
		document.body.appendChild(canvas);
		return canvas;
	}

	private static async initScene(engine: babylon.Engine): Promise<babylon.Scene> {
		const scene = new babylon.Scene(engine);
		return scene;
	};

	show(): void {
		this.engine.runRenderLoop(() => this.scene.render());
	}

	/**@todo usefull ? */
	hide(): void {
		this.engine.stopRenderLoop();
	}

	stop(): void {
		this.sceneManager.destroyEnvironnement(this.scene);
		this.engine.stopRenderLoop();
		this.scene.onAfterRenderObservable.clear();
		this.camera.dispose();
		this.scene.dispose();
		this.engine.dispose();
		this.canvas.remove();
	}

	private setScene(): void {
		this.sceneManager.setEnvironnement(this.scene, this.settings);

		const player = this.sceneManager.players.find(
			(p) => p.username === this.settings.player1.username
		);
		if (!player) {
			console.error(`Player ${this.settings.player1.username} not found`);
			return;
		}

		window.addEventListener("keydown", (event: KeyboardEvent) => {
			const controls = player.handleKeyDown(event);
			this.socket.send(JSON.stringify(controls));
		});
		window.addEventListener("keyup", player.handleKeyUp);

		// window.removeEventListener("keydown", this.handleKeyDown);
		// window.removeEventListener("keyup", this.handleKeyUp);

		/**@todo text GOAL?*/
	}

	/**@todo see if camera can be moved via mouse or keyboard or none */
	private createCamera(): babylon.ArcRotateCamera {
		const camera = new babylon.ArcRotateCamera("camera",
			babylon.Tools.ToRadians(0), babylon.Tools.ToRadians(57.3),
			MAP_SIZE.x * 1.4, babylon.Vector3.Zero(), this.scene);
		/**@todo will be removed, wont be able to move the camera */
		camera.attachControl(this.canvas, true);
		camera.inputs.removeByType("ArcRotateCameraKeyboardMoveInput");
		return camera;
	}

	updatePlayerPositions(username: string, position: Position): void {
		const player = this.sceneManager.players.find(
			(p) => p.username === username
		);
		if (!player) {
			console.error(`Player ${username} not found`);
			return;
		}
		player.mesh.position.x = position.x;
		player.mesh.position.y = position.y;
		player.mesh.position.z = position.z;
	}

	updateBallPositions(position: Position): void {
		const ball = this.sceneManager.getBalls().at(0);
		if (!ball) {
			console.error(`ERROR !!! Ball not found ...`);
			return;
		}
		ball.mesh.position.x = position.x;
		ball.mesh.position.y = position.y;
		ball.mesh.position.z = position.z;
	}
}

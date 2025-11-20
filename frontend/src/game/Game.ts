import * as babylon from "@babylonjs/core";
import { SceneManager } from "./scene/SceneManager.js";
import { GameSettings } from "./settings/GameSettings.js";
import { CAMERA_POS_X,  MOVE_CAMERA_ONCLICK, SHOW_DISPOSE_LOGS, START_TIMEOUT } from "./settings/values.js";
import { DataMessage, ObjectMessage, OptionMessage, Status } from "./types_transfert.js";
import { stopGame } from "./canvas_creation.js";

export class Game {
	private readonly socket: WebSocket;
	private readonly engine: babylon.Engine;
	private readonly scene: babylon.Scene;
	private readonly sceneManager: SceneManager;
	private readonly camera: babylon.ArcRotateCamera;
	private readonly canvas: HTMLCanvasElement;
	private settings: GameSettings;
	// private score: babylon.Vector2;
	// private inAnimation = false;
	// private gameStopped = false;

	constructor (socket: WebSocket, canvas: HTMLCanvasElement, settings: GameSettings, scene: babylon.Scene, engine: babylon.Engine) {
		this.socket = socket;
		this.engine = engine;
		this.canvas = canvas;
		this.settings = settings;
		this.camera = this.createCamera();
		this.sceneManager = new SceneManager(socket, scene, this.camera, settings);
		this.scene = scene;
		window.addEventListener("resize", () => this.engine.resize());
		// this.score = new babylon.Vector2(0, 0);
		this.setScene();

		socket.addEventListener("message", (event) => { /** @todo check if removeEventListener is necesseray and the end of the game */
			const message : DataMessage = JSON.parse(event.data);
			switch (message.status) {
				case (Status.STOP):
					this.stop();
					stopGame();
					break;
				case (Status.RENDER):
					this.setDeltaTime(message.deltaTime);
					break;
				default:
					return; /** do nothing / not an error*/
			}
		});
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

	private setDeltaTime(deltaTime: number): void {
		this.engine.getDeltaTime = (): number => deltaTime;;
	}

	show(): void {
		if (!this.settings)
			return;
		this.engine.runRenderLoop(() => this.scene.render());
	}

	/**@todo usefull ? */
	hide(): void {
		this.engine.stopRenderLoop();
	}

	stop(): void {
		this.sceneManager.destroyScene();
		this.scene.onAfterRenderObservable.clear();
		this.camera.dispose();
		if (SHOW_DISPOSE_LOGS)
			this.sceneManager.showDisposeLogs(this.scene);
		this.engine.stopRenderLoop();
		this.scene.dispose();
		this.engine.dispose();
		this.canvas.remove();
		// this.gameStopped = true;
		babylon.Tools.ClearLogCache(); // hides previous logs 
	}

	private setScene(): void {
		this.sceneManager.createTextures(this.scene);
		this.sceneManager.createPlayers(this.scene, this.settings);
		this.sceneManager.setEnvironnement(this.scene, this.settings);
		
		const player = this.sceneManager.getPlayer(this.settings.player1.playerId);
		if (!player) {
			console.error(`Player ${this.settings.player1.playerId} not found`);
			return;
		}

		window.addEventListener("keydown", (event: KeyboardEvent) => {
			const controls = player.handleKeyDown(event);
			this.socket.send(JSON.stringify(controls));
		});
		window.addEventListener("keyup", (event: KeyboardEvent) => {
			const controls = player.handleKeyUp(event);
			this.socket.send(JSON.stringify(controls));
		});
	}

	private createCamera(): babylon.ArcRotateCamera {
		const cameraAxeLat = 1;
		const cameraAxeLong = this.settings.myId === 1 ? 0 : Math.PI;
		const camera = new babylon.ArcRotateCamera("camera",
			cameraAxeLong, cameraAxeLat,
			CAMERA_POS_X, babylon.Vector3.Zero(), this.scene);
		if (MOVE_CAMERA_ONCLICK) { //debug function
			camera.attachControl(this.canvas, true);
			camera.inputs.removeByType("ArcRotateCameraKeyboardMoveInput");
		}
		return camera;
	}

	updateObject(object: ObjectMessage): void {
		this.sceneManager.updateObject(this.scene, object);
	}

	updateOptions(options: OptionMessage): void {
		this.settings.ball = options.ball;
		this.settings.map = options.map;
		this.settings.rotatingPlayer = options.rotatingPlayer;
		this.settings.spin = options.spin;
		this.sceneManager.setEnvironnement(this.scene, this.settings);
	}

}

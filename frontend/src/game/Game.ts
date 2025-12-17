import * as babylon from "@babylonjs/core";
import { SceneManager } from "./scene/SceneManager.js";
import { PointSettings } from "./settings/PointSettings.js";
import { CAMERA_POS_X,  MOVE_CAMERA_ONCLICK, SHOW_DISPOSE_LOGS } from "./settings/values.js";
import { DataMessage, OptionMessage, Status, StopMessage } from "./types_transfert.js";
import { GameStatistics } from "./screen/GameStatistics.js";

class Game {
	private readonly engine: babylon.Engine;
	private readonly scene: babylon.Scene;
	private readonly sceneManager: SceneManager;
	private readonly camera: babylon.ArcRotateCamera;
	private readonly canvas: HTMLCanvasElement;
	private settings: PointSettings;
	private originalGetDelta: (() => number) | null = null;
	private firstFrame = true;
	private stats: GameStatistics | null = null;

	constructor (canvas: HTMLCanvasElement, settings: PointSettings, scene: babylon.Scene, engine: babylon.Engine) {
		this.engine = engine;
		this.canvas = canvas;
		this.settings = settings;
		this.camera = this.createCamera();
		this.sceneManager = new SceneManager(scene, this.camera, settings);
		this.scene = scene;
		window.addEventListener("resize", () => this.engine.resize());
		this.setScene();

		settings.player1.socket?.addEventListener("message", (event) => { /** @todo check if removeEventListener is necesseray and the end of the game */
			const message : DataMessage = JSON.parse(event.data);
			switch (message.status) {
				case (Status.STOP):
					this.showStats(message);
					break;
				case (Status.RENDER):
					this.setDeltaTime(message.deltaMultiplicator);
					break;
				default:
					return; /** do nothing / not an error*/
			}
		});
	}

	/** returning the constructor because we cant do an async constructor and create() will have to wait for havok.engine to start */
	static async create(settings: PointSettings): Promise<Game> {
		const canvas = Game.createCanvas();
		const engine = new babylon.Engine(canvas);
		const scene = await Game.initScene(engine);
		return new Game(canvas, settings, scene, engine);
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

	private setDeltaTime(multiplicator: number): void {
		if (this.firstFrame)
			return ;
		this.engine.getDeltaTime = (): number => {
			if (this.originalGetDelta === null)
				return 0;
			return this.originalGetDelta() * multiplicator;
		};
	}

	show(): void {
		if (!this.settings)
			return;
		this.engine.runRenderLoop(() => {
			this.scene.render();
			if (this.firstFrame) {
				this.originalGetDelta = this.engine.getDeltaTime.bind(this.engine);
				this.firstFrame = false;
			}
		});
	}

	private showStats(message: StopMessage): void {
		this.engine.stopRenderLoop();
		this.sceneManager.getPlayer(1)?.clearListeners();
		this.sceneManager.getPlayer(2)?.clearListeners();
		this.stats = new GameStatistics(message.gameStats);
	}

	closeGame(): void {
		this.sceneManager.destroyScene();
		this.camera.dispose();
		if (SHOW_DISPOSE_LOGS)
			this.sceneManager.showDisposeLogs(this.scene);
		this.scene.dispose();
		this.engine.dispose();
		this.canvas.remove();
	}

	private setScene(): void {
		this.sceneManager.createPlayers(this.scene, this.settings);
		this.sceneManager.setEnvironnement(this.scene, this.settings);
		
		const player = this.sceneManager.getPlayer(this.settings.player1.playerId);
		if (!player) {
			console.error(`Player ${this.settings.player1.playerId} not found`);
			return;
		}
	}

	private createCamera(): babylon.ArcRotateCamera {
		let cameraAxeLat = 1;
		let cameraAxeLong = this.settings.player1.playerId === 1 ? 0 : Math.PI;
		if (this.settings.player2.socket) {
			cameraAxeLat /= 1.5;
			cameraAxeLong = Math.PI / 2;
		}
		const camera = new babylon.ArcRotateCamera("camera",
			cameraAxeLong, cameraAxeLat,
			CAMERA_POS_X, babylon.Vector3.Zero(), this.scene);
		if (MOVE_CAMERA_ONCLICK) { //debug function
			camera.attachControl(this.canvas, true);
			camera.inputs.removeByType("ArcRotateCameraKeyboardMoveInput");
		}
		return camera;
	}

	updateOptions(options: OptionMessage): void {
		this.settings.ball = options.ball;
		this.settings.map = options.map;
		this.settings.wind = options.wind;
		this.settings.rotatingPlayer = options.rotatingPlayer;
		this.settings.spin = options.spin;
		this.sceneManager.setEnvironnement(this.scene, this.settings);
	}

}

export { Game };

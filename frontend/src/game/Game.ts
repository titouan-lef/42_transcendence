import * as babylon from "@babylonjs/core";
import { SceneManager } from "./scene/SceneManager.js";
import { PointSettings } from "./settings/PointSettings.js";
import { CAMERA_POS_X,  MOVE_CAMERA_ONCLICK } from "./settings/values.js";
import { DataMessage, OptionMessage, Status } from "#shared/types_transfert.js";
import { getSafeElement } from "../utils/getSafeElement.js";
import { loadMainDashboard } from "../pages/modules/box/box_main_dashboard.js";

class Game {
	private readonly engine: babylon.Engine;
	private readonly scene: babylon.Scene;
	private readonly sceneManager: SceneManager;
	private readonly camera: babylon.ArcRotateCamera;
	private readonly canvas: HTMLCanvasElement;
	private settings: PointSettings;
	private originalGetDelta: (() => number) | null = null;
	private firstFrame = true;
	private gameEnded = false;

	constructor (canvas: HTMLCanvasElement, settings: PointSettings, scene: babylon.Scene, engine: babylon.Engine) {
		this.engine = engine;
		this.canvas = canvas;
		this.settings = settings;
		this.camera = this.createCamera();
		this.sceneManager = new SceneManager(scene, this.camera, settings);
		this.scene = scene;
		window.addEventListener("resize", () => this.engine.resize());
		this.setScene();

		settings.player1.socket?.addEventListener("message", (event) => {
			const message : DataMessage = JSON.parse(event.data);
			switch (message.status) {
				case (Status.STOP):
					this.closeGame();
					loadMainDashboard(message.gameStats);
					break;
				case (Status.RENDER):
					this.setDeltaTime(message.deltaMultiplicator);
					break;
				default:
					return;
			}
		});
	}

	/** returning the constructor because we cant do an async constructor and create() will have to wait for havok.engine to start */
	static async create(settings: PointSettings): Promise<Game | null> {
		const canvas = getSafeElement('game-canvas', HTMLCanvasElement);
		let engine: babylon.Engine | null = null;
		try {
			engine = new babylon.Engine(canvas);
		} catch {
			const parent = canvas.parentElement;
			if (parent) {
				parent.innerHTML = `
					<div class="flex flex-col items-center gap-2 text-center text-warning">
						<p class="font-semibold">
							WebGL failed: we are sorry for the inconvenience
						</p>
						<p class="opacity-80">
							Please restart your browser
						</p>
					</div>
				`;
			}
		}
		if (!engine)
			return null;
		const scene = await Game.initScene(engine);
		return new Game(canvas, settings, scene, engine);
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

	closeGame(): void {
		this.sceneManager.destroyScene();
		this.camera.dispose();
		this.scene.dispose();
		this.engine.dispose();
		this.canvas.remove();
		this.gameEnded = true;
		this.settings.player1.socket?.close();
		this.settings.player2.socket?.close();
	}

	isGameFinished(): boolean {
		return this.gameEnded;
	}

	private setScene(): void {
		this.sceneManager.createPlayers(this.scene, this.settings);
		this.sceneManager.setEnvironnement(this.scene, this.settings);

		const player = this.sceneManager.getPlayer(this.settings.player1.playerId);
		if (!player)
			return;
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
		if (MOVE_CAMERA_ONCLICK) {
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

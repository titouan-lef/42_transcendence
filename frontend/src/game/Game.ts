import * as babylon from "@babylonjs/core";
import { SceneManager } from "./SceneManager.js";
import { GameSettings } from "./GameSettings.js";
import { HavokPlugin } from "@babylonjs/core/Physics";
import havokPhysics from "@babylonjs/havok";
import { MAP_SIZE, POINTS_TO_WIN } from "./values.js";

export class Game {
	private readonly engine: babylon.Engine;
	private readonly scene: babylon.Scene;
	private readonly sceneManager: SceneManager;
	private readonly settings: GameSettings;
	private readonly camera: babylon.ArcRotateCamera;
	private canvas: HTMLCanvasElement;
	private score: babylon.Vector2;

	constructor (canvas: HTMLCanvasElement, settings: GameSettings, scene: babylon.Scene, engine: babylon.Engine) {
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
	static async create(settings: GameSettings): Promise<Game> {
		const canvas = Game.createCanvas();
		const engine = new babylon.Engine(canvas, true);
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

		const havokInstance = await havokPhysics({
			locateFile: (fileName) => `/dist/public/${fileName}` // tells havok where to fetch the WASM file
		});
		const havokPlugin = new HavokPlugin(true, havokInstance);
		scene.enablePhysics(new babylon.Vector3(0, -9.81, 0), havokPlugin);
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
}

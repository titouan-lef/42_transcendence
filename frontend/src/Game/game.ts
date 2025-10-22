import * as babylon from "/babylonjs/core/index.js";
import { SceneManager } from "./sceneManager.js";
import { GameSettings } from "./gameSettings.js";
import { GLOW_INTENSITY } from "./values.js";
import { HavokPlugin } from "/babylonjs/core/Physics/index.js";
import havokPhysics from "/babylonjs/havok/lib/esm/HavokPhysics_es.js";
import { POINTS_TO_WIN } from "./values.js";

export class Game {
	private readonly canvas: HTMLCanvasElement;
	private readonly engine: babylon.Engine;
	private readonly scene: babylon.Scene;
	private readonly sceneManager: SceneManager;
	private readonly settings: GameSettings;
	private readonly camera: babylon.ArcRotateCamera;
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

	/** 
	 * returning the constructor because we cant do an async constructor and create() will have to wait for havok.engine to start
	 */
	static async create(canvas: HTMLCanvasElement, settings: GameSettings): Promise<Game> {
		const engine = new babylon.Engine(canvas, true);
		const scene = await Game.initScene(engine);
		return new Game(canvas, settings, scene, engine);
	}

	private static async initScene(engine: babylon.Engine): Promise<babylon.Scene> {
		const scene = new babylon.Scene(engine);
		const havokInstance = await havokPhysics();
		const havokPlugin = new HavokPlugin(true, havokInstance);
		scene.enablePhysics(new babylon.Vector3(0, -9.81, 0), havokPlugin);
		return scene;
	};

	show(): void {
		this.engine.runRenderLoop(() => this.scene.render());
	}

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
	}

	private setScene(): void {
		this.sceneManager.setEnvironnement(this.scene, this.settings);

		/**@todo text?*/

		/**@todo just to make the ball move, will be removed*/
		const sceneManager = this.sceneManager;
		this.scene.onPointerDown = (): void => {
			sceneManager.getBalls().forEach(ball => ball.testMove());
		};

		const sceneObserver = this.scene.onAfterRenderObservable.add(() => {
			this.checkEndOfPoint();
		});
		/**@todo fin du jeu = this.scene.onAfterRenderObservable.remove(sceneObserver);  */
	}

	/**check collision for each balls */
	checkEndOfPoint(): void {
		const goal = this.sceneManager.checkGoal();
		if (goal !== null) {
			/**@todo inscrire goal */
			if (goal === "player2") {
				this.score.x += 1;
				console.log("player 2 goaled");
			} else{
				this.score.y += 1;
				console.log("player 1 goaled");
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
			babylon.Tools.ToRadians(0), babylon.Tools.ToRadians(57.3), 10, babylon.Vector3.Zero(), this.scene);
		camera.setTarget(babylon.Vector3.Zero());
		camera.attachControl(this.canvas, true);
		camera.inputs.removeByType("ArcRotateCameraKeyboardMoveInput");
		return camera;
	}
}

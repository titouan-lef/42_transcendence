import * as babylon from "/babylonjs/index.js";
import { SceneManager } from "./sceneManager.js";
import { GameSettings } from "./gameSettings.js";
import { GLOW_INTENSITY } from "./values.js";

export class Game {
	private readonly canvas: HTMLCanvasElement;
	private readonly engine: babylon.Engine;
	private readonly scene: babylon.Scene;
	private readonly sceneManager: SceneManager;
	private readonly settings: GameSettings;

	constructor (canvas: HTMLCanvasElement, settings: GameSettings, scene: babylon.Scene, engine: babylon.Engine) {
		this.engine = engine;
		this.canvas = canvas;
		this.settings = settings;
		this.sceneManager = new SceneManager();
		this.scene = scene;
		window.addEventListener("resize", () => this.engine.resize());
		this.setScene();
	}

	/** 
	 * returning the constructor because we cant do an async constructor and create() will have to wait for havok.engine to start
	 */
	static async create(canvas: HTMLCanvasElement, settings: GameSettings): Promise<Game> {
		const engine = new babylon.Engine(canvas, true);
		const scene = await Game.initScene(engine);
		return new Game(canvas, settings, scene, engine);
	}

	/**@todo const havokInstance = await HavokPhysics(); const havokPlugin = new BABYLON.HavokPlugin(true, havokInstance); scene.enablePhysics(new BABYLON.Vector3(0, -9.81, 0), havokPlugin); */
	private static async initScene(engine: babylon.Engine): Promise<babylon.Scene> {
		const scene = new babylon.Scene(engine);
		return scene;
	};

	show(): void {
		this.engine.runRenderLoop(() => this.scene.render());
	}

	hide(): void {
		this.engine.stopRenderLoop();
	}

	stop(): void {
		this.engine.stopRenderLoop();
		this.scene.dispose();
		this.engine.dispose();
	}

	private setScene(): void {
		this.createCamera();
		/**@todo glow should be in map too ? depends of if i use it for different things or not*/
		const glow = new babylon.GlowLayer("glow", this.scene);
		glow.intensity = GLOW_INTENSITY;
		this.sceneManager.setEnvironnement(this.scene, this.settings);
		/**@todo game loop */
		let alpha = 0;
		this.scene.onBeforeRenderObservable.add( () => {
			this.sceneManager.balls.forEach(ball => ball.testfunction(alpha));
			alpha += 0.01;
			if (alpha > 1) {
				alpha = 0;
				this.sceneManager.destroyEnvironnement();
				this.sceneManager.setEnvironnement(this.scene, this.settings);
			}
		});
	}

	/**@todo see if camera can be moved via mouse or keyboard or none */
	private createCamera(): void {
		const camera = new babylon.ArcRotateCamera("camera",
			babylon.Tools.ToRadians(0), babylon.Tools.ToRadians(57.3), 10, babylon.Vector3.Zero(), this.scene);
		camera.setTarget(babylon.Vector3.Zero());
		camera.attachControl(this.canvas, true);
		camera.inputs.removeByType("ArcRotateCameraKeyboardMoveInput");
	}
}

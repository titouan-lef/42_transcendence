import * as babylon from "@babylonjs/core";
import { SceneManager } from "./scene/SceneManager.js";
import { GameSettings } from "./settings/GameSettings.js";
import { HavokPlugin } from "@babylonjs/core/Physics";
import havokPhysics from "@babylonjs/havok";
import { CAMERA_POS_X, POINTS_TO_WIN } from "./settings/values.js";

export class Game {
	private readonly engine: babylon.Engine;
	private readonly scene: babylon.Scene;
	private readonly sceneManager: SceneManager;
	private readonly settings: GameSettings;
	private readonly camera: babylon.ArcRotateCamera;
	private canvas: HTMLCanvasElement;
	private score: babylon.Vector2;
	private inAnimation = false;
	private gameStopped = false;

	constructor (canvas: HTMLCanvasElement, settings: GameSettings, scene: babylon.Scene, engine: babylon.Engine) {
		this.engine = engine;
		this.canvas = canvas;
		this.settings = settings;
		this.camera = this.createCamera();
		this.sceneManager = new SceneManager(scene, this.camera);
		this.scene = scene;
		window.addEventListener("resize", () => this.engine.resize());
		this.score = new babylon.Vector2(0, 0);
		this.setScene();
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
		this.sceneManager.destroyTextures();
		this.sceneManager.destroyEnvironnement();
		this.sceneManager.destroyScore();
		this.scene.onAfterRenderObservable.clear();
		this.camera.dispose();
		this.engine.stopRenderLoop();
		// this.scene.materials.forEach(mat => mat.dispose()); // these are the defualt materials, not sure if i have to dispose them since they are created auto
		// console.log("meshes : " + this.scene.meshes);
		// console.log("materials : " + this.scene.materials);
		// this.scene.materials.forEach(mat => {
		// 	console.log("mat name : " + mat.name);
		// });
		// console.log("textures : " + this.scene.textures);
		// this.scene.textures.forEach(texture => {
		// 	console.log("texture name : " + texture.name);
		// });
		// console.log("lights : " + this.scene.lights);
		// console.log("particle system: " + this.scene.particleSystems);
		this.scene.dispose();
		this.engine.dispose();
		this.canvas.remove();
		this.gameStopped = true;
		babylon.Tools.ClearLogCache(); // hides previous logs 
	}

	private setScene(): void {
		this.sceneManager.createTextures(this.scene);
		this.sceneManager.setEnvironnement(this.scene, this.settings, this.score);
		/**@todo text GOAL?*/

		/**@todo just to make the ball move, will be removed*/
		const sceneManager = this.sceneManager;
		this.scene.onPointerDown = (): void => {
			const ball = sceneManager.getBall();
			ball?.testMove();
			ball?.setJustCollide();
		};

		this.scene.onAfterRenderObservable.add(() => {
			if (this.inAnimation === false) {
				this.checkEndOfPoint();
			}
		});
	}

	/**check collision for each balls */
	async checkEndOfPoint(): Promise<void> {
		const goalInfos = this.sceneManager.checkGoal();
		if (goalInfos !== null && goalInfos.position !== null) {
			this.inAnimation = true;
			if (goalInfos.goal === "player1") {
				this.score.x += 1;
			} else{
				this.score.y += 1;
			}
			await this.sceneManager.goalAnimation(this.engine, this.scene, goalInfos.position, this.score);
			if (this.gameStopped) // if closing game while animation
				return ;
			if (this.score.x === POINTS_TO_WIN || this.score.y === POINTS_TO_WIN) {
				this.stop();
			} else {
				this.inAnimation = false;
				this.sceneManager.destroyEnvironnement();
				this.sceneManager.setEnvironnement(this.scene, this.settings, this.score);
			}
		}
	}

	/**@todo see if camera can be moved via mouse or keyboard or none */
	private createCamera(): babylon.ArcRotateCamera {
		const cameraAxeLat = 1;
		let cameraAxeLong;
		if (this.settings.playerId === 1) {
			cameraAxeLong = 0;
		} else {
			cameraAxeLong = Math.PI;
		}
		const camera = new babylon.ArcRotateCamera("camera",
			cameraAxeLong, cameraAxeLat,
			CAMERA_POS_X, babylon.Vector3.Zero(), this.scene);
		/**@todo will be removed, wont be able to move the camera */
		camera.attachControl(this.canvas, true);
		camera.inputs.removeByType("ArcRotateCameraKeyboardMoveInput");
		return camera;
	}
}

//import { Scene, Engine, ArcRotateCamera, HemisphericLight, Tools, Vector3} from "@babylonjs/core/Legacy/legacy.js";
// import HavokPhysics from "@babylonjs/havok";
// import * as materials from 'babylonjs-materials';
// import * as babylon from 'babylonjs';
import { GameSettings, MapOption, BallOption } from "./gameSettings.js";
import { DefaultBall, HeavyBall, InvisibleBall, SnakeBall, TrickyBall } from "./ballTemplate.js";
import { DefaultMap, VolcanoMap, WindyMap, FrozenMap, RainyMap} from "./mapTemplate.js";
import { SceneManager } from "./sceneManager.js";
import { Player } from "./player.js";

export class Game {
	private readonly canvas: HTMLCanvasElement;
	private readonly engine: BABYLON.Engine;
	private readonly scene: BABYLON.Scene;
	private readonly sceneManager: SceneManager;
	private readonly settings: GameSettings;

	constructor (canvas: HTMLCanvasElement, settings: GameSettings, scene: BABYLON.Scene, engine: BABYLON.Engine) {
		this.engine = engine;
		this.canvas = canvas;
		this.settings = settings;
		this.sceneManager = new SceneManager();
		// this.createScene().then((scene) => {
		// 	this.scene = scene;
		// })
		//this.scene = this.createScene();
		this.scene = scene;
		window.addEventListener("resize", () => this.engine.resize());
		this.setScene();
	}

	static async create(canvas: HTMLCanvasElement, settings: GameSettings): Promise<Game>{
		const engine = new BABYLON.Engine(canvas, true);
		const scene = await Game.initScene(engine);
		return new Game(canvas, settings, scene, engine);
	}

	private static async initScene(engine: BABYLON.Engine): Promise<BABYLON.Scene>{
		const scene = new BABYLON.Scene(engine);
		// TEST
		// const havokInstance = await HavokPhysics();
		// const havokPlugin = new BABYLON.HavokPlugin(true, havokInstance);
		// scene.enablePhysics(new BABYLON.Vector3(0, -9.81, 0), havokPlugin);
		//
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
		this.createLight(); // maybe light should be in Map

		//TEST
		// const skybox = BABYLON.MeshBuilder.CreateBox("skyBox", {size:150}, this.scene);
		// const skyboxMaterial = new BABYLON.StandardMaterial("skyBox", this.scene);
		// skyboxMaterial.backFaceCulling = false;
		// skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("textures/skybox", this.scene);
		// skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
		// skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
		// skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
		// skybox.material = skyboxMaterial;
		//
		//
		this.createPlayers(this.settings);
		this.createBall(this.settings.ball);
		this.createMap(this.settings.map);
		//

		//test
		// const glow = new BABYLON.GlowLayer("glow", scene);
		// glow.intensity = 0.9;
		//

		//let alpha = 0;
		this.scene.onBeforeRenderObservable.add( () => {
			//this.sceneManager.players.forEach(player => player.move());
			// this.sceneManager.balls.forEach(ball => ball.testfunction(alpha));
			// alpha += 0.01;
			// if (alpha > 1){
			// 	alpha = 0;
			// 	this.sceneManager.destroyBalls();
			// 	this.createBall(this.settings.ball);
			// }
		});
		//HERE if an goal occurs, rebuild the scene => scene manager has to dispose classes
	}

	private createCamera(): void{
		const camera = new BABYLON.ArcRotateCamera("camera",
			BABYLON.Tools.ToRadians(0), BABYLON.Tools.ToRadians(57.3), 10, BABYLON.Vector3.Zero(), this.scene);
		camera.setTarget(BABYLON.Vector3.Zero());
		camera.attachControl(this.canvas, true);
		//keyboard inputs causing conflicts with addeventlistener
		camera.inputs.removeByType("ArcRotateCameraKeyboardMoveInput");
	}

	private createLight(): void {
		const light = new BABYLON.HemisphericLight("light",
			new BABYLON.Vector3(0, 1, 0), this.scene);
		light.intensity = 0.7;
	}

	private createBall(ball: BallOption): void {
		const ballList: BallOption[] = ["default", "invisible", "tricky", "heavy", "snake"];
		if (ball === "random"){
			ball = ballList[Math.floor(Math.random() * 5)];
		}
		switch (ball){
			case "default":
				this.sceneManager.addBall(new DefaultBall(this.scene));
				break;
			case "invisible":
				this.sceneManager.addBall(new InvisibleBall(this.scene));
				break;
			case "tricky":
				this.sceneManager.addBall(new TrickyBall(this.scene));
				break;
			case "heavy":
				this.sceneManager.addBall(new HeavyBall(this.scene));
				break;
			case "snake":
				this.sceneManager.addBall(new SnakeBall(this.scene));
				break;
			default: ;
		}
	}

	private createMap(map: MapOption): void {
		const mapList: MapOption[] = ["default", "volcano", "windy", "frozen", "rainy"];
		if (map === "random"){
			map = mapList[Math.floor(Math.random() * 5)];
		}
		switch (map){
			case "default":
				this.sceneManager.addMap(new DefaultMap(this.scene));
				break;
			case "volcano":
				this.sceneManager.addMap(new VolcanoMap(this.scene));
				break;
			case "windy":
				this.sceneManager.addMap(new WindyMap(this.scene));
				break;
			case "frozen":
				this.sceneManager.addMap(new FrozenMap(this.scene));
				break;
			case "rainy":
				this.sceneManager.addMap(new RainyMap(this.scene));
				break;
			default: ;
		}
	}

	private createPlayers(settings: GameSettings): void{
		const player1 = new Player(this.scene, settings, settings.player1Keys);
		player1.mesh.position.x = +32;
		const player2 = new Player(this.scene, settings, settings.player2Keys);
		player2.mesh.position.x = -32;
		this.sceneManager.addPlayers(player1, player2);
	}
}

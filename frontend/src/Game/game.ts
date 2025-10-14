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
		/**@todo havok initialisation */
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

		this.createPlayers(this.settings);
		this.createBall(this.settings.ball);
		this.createMap(this.settings.map);

		this.scene.onBeforeRenderObservable.add( () => {
			/** @todo fonction to test insertion of data in the db with this.sceneManager.balls.forEach(ball => ball.activateEffet());*/
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

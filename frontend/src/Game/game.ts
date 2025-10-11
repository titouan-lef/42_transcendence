import { GameSettings, MapOption, BallOption } from "./gameSettings.js";
import { BallTemplate, DefaultBall, HeavyBall, InvisibleBall, SnakeBall, TrickyBall } from "./ballTemplate.js";
import { MapTemplate, DefaultMap, VolcanoMap, WindyMap, FrozenMap, RainyMap} from "./mapTemplate.js";

export class Game {
	private readonly canvas: HTMLCanvasElement;
	private readonly engine: BABYLON.Engine;
	private readonly scene: BABYLON.Scene;
	private readonly settings: GameSettings;

	constructor (canvas: HTMLCanvasElement, settings: GameSettings) {
		this.engine = new BABYLON.Engine(canvas, true);
		this.canvas = canvas;
		this.settings = settings;
		this.scene = this.createScene();
		window.addEventListener("resize", () => this.engine.resize());
	}

	public start(): void {
		this.engine.runRenderLoop(() => this.scene.render());
	}

	public pause(): void {
		this.engine.stopRenderLoop();
	}
	
	public stop(): void {
		this.engine.stopRenderLoop();
		this.scene.dispose();
		this.engine.dispose();
	}

	private createScene(): BABYLON.Scene{

		const scene = new BABYLON.Scene(this.engine);
		// Have to make a class scene manager to destroy and rebuild the meshes of every classes
		this.createCamera();
		this.createLight();
		
		this.createMap(this.settings.map);

		this.createBall(this.settings.ball);

		
		// let alpha = 0;
		// scene.onBeforeRenderObservable.add( () => {
		// 	sphere.scaling.y = Math.cos(alpha);
		// 	alpha += 0.01;
		// });
		return scene;
	};

	private createCamera(): void{
		const camera = new BABYLON.ArcRotateCamera("camera", 
			BABYLON.Tools.ToRadians(0), BABYLON.Tools.ToRadians(57.3), 10, BABYLON.Vector3.Zero(), this.scene);
		camera.setTarget(BABYLON.Vector3.Zero());
		camera.attachControl(this.canvas, true);
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
				new DefaultBall(this.scene);
				break;
			case "invisible":
				new InvisibleBall(this.scene);
				break;
			case "tricky":
				new TrickyBall(this.scene);
				break;
			case "heavy":
				new HeavyBall(this.scene);
				break;
			case "snake":
				new SnakeBall(this.scene);
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
				new DefaultMap(this.scene);
				break;
			case "volcano":
				new VolcanoMap(this.scene);
				break;
			case "windy":
				new WindyMap(this.scene);
				break;
			case "frozen":
				new FrozenMap(this.scene);
				break;
			case "rainy":
				new RainyMap(this.scene);
				break;
			default: ;
		}
	}
}

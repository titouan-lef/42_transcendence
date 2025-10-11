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
		this.setCamera();
		this.setLight();
		
		this.createBall(this.settings.ball);

		this.createMap(this.settings.map);
		
		// let alpha = 0;
		// scene.onBeforeRenderObservable.add( () => {
		// 	sphere.scaling.y = Math.cos(alpha);
		// 	alpha += 0.01;
		// });
		return scene;
	};

	private setCamera(): void{
		const camera = new BABYLON.ArcRotateCamera("camera", 
			BABYLON.Tools.ToRadians(0), BABYLON.Tools.ToRadians(57.3), 10, BABYLON.Vector3.Zero(), this.scene);
		camera.setTarget(BABYLON.Vector3.Zero());
		camera.attachControl(this.canvas, true);
	}

	private setLight(): void {
		const light = new BABYLON.HemisphericLight("light", 
			new BABYLON.Vector3(0, 1, 0), this.scene);
		light.intensity = 0.7;
	}

	private createBall(ball: BallOption): void {
		const ballList: Record<string, typeof BallTemplate> = {
			"default": DefaultBall,
			"invisible": InvisibleBall,
			"tricky": TrickyBall,
			"heavy": HeavyBall,
			"snake": SnakeBall
		};
		const ballArray: Array<typeof BallTemplate> = [DefaultBall, InvisibleBall, TrickyBall, HeavyBall, SnakeBall];
		let ballClass: typeof BallTemplate;
		if (ball === "random"){
			ballClass = ballArray[Math.floor(Math.random() * 5)];
		} else{
			ballClass =  ballList[ball];
		}
		new ballClass(this.scene, ball);
	}

	private createMap(map: MapOption): void {
		const mapList: Record<string, typeof MapTemplate> = {
			"default": DefaultMap,
			"volcano": VolcanoMap,
			"windy": WindyMap,
			"frozen": FrozenMap,
			"rainy": RainyMap
		};
		const mapArray: Array<typeof MapTemplate> = [DefaultMap, VolcanoMap, WindyMap, FrozenMap, RainyMap];
		let mapClass: typeof MapTemplate;
		if (map === "random"){
			mapClass = mapArray[Math.floor(Math.random() * 5)];
		} else{
			mapClass =  mapList[map];
		}
		new mapClass(this.scene, map);
	}
}

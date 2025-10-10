import { GameSettings, MapOption, BallOption } from "./gameSettings.js";
import { BallTemplate, HeavyBall, InvisibleBall, SnakeBall, TrickyBall } from "./ballTemplate.js";

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

		const ground = BABYLON.MeshBuilder.CreateGround("ground", 
			{width: 6, height: 6}, scene);
		
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
		const ballMap: Record<string, typeof BallTemplate> = {
			"default": BallTemplate,
			"invisible": InvisibleBall,
			"tricky": TrickyBall,
			"heavy": HeavyBall,
			"snake": SnakeBall
		};
		const ballArray: Array<typeof BallTemplate> = [BallTemplate, InvisibleBall, TrickyBall, HeavyBall, SnakeBall];
		let ballClass: typeof BallTemplate;
		if (ball === "random"){
			ballClass = ballArray[Math.floor(Math.random() * 5)];
			ball = "default";
		} else{
			ballClass =  ballMap[ball];
		}
		new ballClass(this.scene, ball);
	};
}

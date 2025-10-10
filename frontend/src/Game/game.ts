import { GameSettings } from "./gameSettings.js";
//import * as BABYLON from 'babylonjs';

export class Game {
	private readonly canvas: HTMLCanvasElement;
	private readonly engine: BABYLON.Engine;
	private readonly scene: BABYLON.Scene;

	constructor (canvas: HTMLCanvasElement, settings: GameSettings) {
		this.engine = new BABYLON.Engine(canvas, true);
		this.canvas = canvas;
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
		const camera = new BABYLON.ArcRotateCamera("camera", BABYLON.Tools.ToRadians(0), BABYLON.Tools.ToRadians(57.3), 10, BABYLON.Vector3.Zero(), this.scene);
		camera.setTarget(BABYLON.Vector3.Zero());
		camera.attachControl(this.canvas, true);
		const light = new BABYLON.HemisphericLight("light", 
			new BABYLON.Vector3(0, 1, 0), scene);
		light.intensity = 0.7;
		
		const sphere = BABYLON.MeshBuilder.CreateSphere("sphere", 
			{diameter: 2, segments: 32}, scene);
		sphere.position.y = 1;
		const ground = BABYLON.MeshBuilder.CreateGround("ground", 
			{width: 6, height: 6}, scene);
		
		let alpha = 0;
		scene.onBeforeRenderObservable.add( () => {
			sphere.scaling.y = Math.cos(alpha);
			alpha += 0.01;
		});
		return scene;
	};
}

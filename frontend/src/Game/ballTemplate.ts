import { BallOption } from "./gameSettings.js";

export abstract class BallTemplate {
	protected readonly mesh: BABYLON.Mesh;
	protected readonly type: BallOption;

	constructor(scene: BABYLON.Scene, type: BallOption) {
		this.mesh = BABYLON.MeshBuilder.CreateSphere(type + "ball", {diameter: 2, segments: 32}, scene);
		this.mesh.position.y = 1;
		this.type = type;
	}

	abstract activateEffet(): void;

	testfunction(value: number): void{
		this.mesh.scaling.y = value;
	}

	destroy(): void {
		this.mesh.dispose();
	}
}

export class DefaultBall extends BallTemplate {
	constructor(scene: BABYLON.Scene) {
		super(scene, "default");
		const material = new BABYLON.StandardMaterial('color', scene);
		material.diffuseColor = new BABYLON.Color3(0, 1, 0);
		this.mesh.material = material;
	}

	activateEffet(): void {
		
	}
}

export class InvisibleBall extends BallTemplate {
	constructor(scene: BABYLON.Scene) {
		super(scene, "invisible");
	}

	activateEffet(): void {
		
	}
}

export class TrickyBall extends BallTemplate {
	constructor(scene: BABYLON.Scene) {
		super(scene, "tricky");
	}

	activateEffet(): void {
		
	}
}

export class HeavyBall extends BallTemplate {
	constructor(scene: BABYLON.Scene) {
		super(scene, "heavy");
	}

	activateEffet(): void {
		
	}
}

export class SnakeBall extends BallTemplate {
	constructor(scene: BABYLON.Scene) {
		super(scene, "snake");
	}

	activateEffet(): void {
		
	}
}
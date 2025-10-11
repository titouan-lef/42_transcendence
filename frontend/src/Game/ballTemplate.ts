import { BallOption } from "./gameSettings.js";

export class BallTemplate {
	readonly mesh: BABYLON.Mesh;
	readonly type: string = "balltemplate";

	constructor(scene: BABYLON.Scene, name: string) {
		this.mesh = BABYLON.MeshBuilder.CreateSphere(name, {diameter: 2, segments: 32}, scene);
		this.mesh.position.y = 1;
	}
}

export class DefaultBall extends BallTemplate {
	readonly type: BallOption = "default";

	constructor(scene: BABYLON.Scene) {
		super(scene, "default");
	}
}

export class InvisibleBall extends BallTemplate {
	readonly type: BallOption = "invisible";

	constructor(scene: BABYLON.Scene) {
		super(scene, "invisible");
	}
}

export class TrickyBall extends BallTemplate {
	readonly type: BallOption = "tricky";

	constructor(scene: BABYLON.Scene) {
		super(scene, "tricky");
	}
}

export class HeavyBall extends BallTemplate {
	readonly type: BallOption = "heavy";

	constructor(scene: BABYLON.Scene) {
		super(scene, "heavy");
	}
}

export class SnakeBall extends BallTemplate {
	readonly type: BallOption = "snake";

	constructor(scene: BABYLON.Scene) {
		super(scene,"snake");
	}
}
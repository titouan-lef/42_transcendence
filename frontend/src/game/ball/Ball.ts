import * as babylon from "@babylonjs/core";
import { BallOption } from "../settings/GameSettings.js";
import { BALL_DIAMETER, BALL_TRAIL_INTERVAL, BALL_TRAIL_ON } from "../settings/values.js";
import { BallTrail } from "./BallTrail.js";
import { Position } from "../types_transfert.js";

class Ball {
	protected readonly color: babylon.Color3;
	private readonly ballTrails: BallTrail[] = [];
	protected readonly mesh: babylon.Mesh;
	private sceneObservable: babylon.Observable<babylon.Scene> | null = null;
	private sceneObserver: babylon.Observer<babylon.Scene> | null = null;
	private trailTimer = 0;

	constructor(scene: babylon.Scene, type: BallOption, color: babylon.Color3) {
		this.mesh = babylon.MeshBuilder.CreateSphere(type + "ball", { diameter: BALL_DIAMETER, segments: 32 }, scene);
		this.mesh.renderingGroupId = 1;
		this.color = color;
		this.setMaterial(scene);
		if (BALL_TRAIL_ON) {
			this.sceneObservable = scene.onBeforeRenderObservable;
			this.sceneObserver = this.observeScene(scene);
		}
	}

	private setMaterial(scene: babylon.Scene): void {
		const material = new babylon.StandardMaterial('ballcolor', scene);
		material.emissiveColor = this.color;
		this.mesh.material = material;
	}

	/** trail behind the ball */
	private observeScene(scene: babylon.Scene): babylon.Observer<babylon.Scene> | null {
		if (!this.sceneObservable)
			return null;
		const sceneObserver = this.sceneObservable?.add(() => {
			this.trailTimer++;
			if (this.trailTimer < BALL_TRAIL_INTERVAL)
				return;
			this.ballTrails.push(new BallTrail(scene, this.mesh.position, this.color, this.mesh.visibility));
			while (this.ballTrails.length && this.ballTrails[0].hasDisappeared())
				this.ballTrails.splice(0, 1);
			this.trailTimer = 0;
		});
		return sceneObserver;
	}

	setPosition(position: Position): void {
		this.mesh.position.x = position.x;
		this.mesh.position.y = position.y;
		this.mesh.position.z = position.z;
	}

	setVisibility(visibility: number): void {
		this.mesh.visibility = visibility;
	}

	destroy(): void {
		this.sceneObservable?.remove(this.sceneObserver);
		while (this.ballTrails.length) {
			this.ballTrails[0].destroy();
			this.ballTrails.splice(0, 1);
		}
		this.mesh?.material?.dispose();
		this.mesh?.dispose();
	}
}

export { Ball };

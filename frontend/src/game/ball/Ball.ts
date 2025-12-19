import * as babylon from "@babylonjs/core";
import { BallOption } from "../settings/GameRules.js";
import { BALL_DIAMETER, BALL_TRAIL_INTERVAL, BALL_TRAIL_ON } from "../settings/values.js";
import { BallTrail } from "./BallTrail.js";
import { Position } from "../../../shared/types_transfert";

class Ball {
	protected readonly color: babylon.Color3;
	private readonly ballTrails: BallTrail[] = [];
	protected readonly mesh: babylon.Mesh;
	private sceneObservable: babylon.Observable<babylon.Scene> | null = null;
	private sceneObserver: babylon.Observer<babylon.Scene> | null = null;
	private trailTimer = 0;

	constructor(scene: babylon.Scene, type: BallOption, color: babylon.Color3, canonBall?: boolean) {
		this.mesh = babylon.MeshBuilder.CreateSphere(type + "ball", { diameter: BALL_DIAMETER, segments: 32 }, scene);
		this.mesh.renderingGroupId = 1;
		this.color = color;
		this.setMaterial(scene);
		if (canonBall)
			this.addRing(scene);
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

	private addRing(scene: babylon.Scene): void {
		const ring = babylon.MeshBuilder.CreateTorus(
			"ballRing",
			{
				diameter: BALL_DIAMETER * 2,
				thickness: BALL_DIAMETER * 0.2,
				tessellation: 32,
			},
			scene
		);
		ring.renderingGroupId = 1;
		ring.parent = this.mesh;

		const mat = new babylon.StandardMaterial("ringMat", scene);
		mat.emissiveColor = this.color.scale(0.6);
		mat.diffuseColor = this.color;
		ring.material = mat;
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
		this.mesh?.getChildMeshes().forEach(child => {
			child.material?.dispose();
			child.dispose();
		});
		this.mesh?.material?.dispose();
		this.mesh?.dispose();
	}
}

export { Ball };

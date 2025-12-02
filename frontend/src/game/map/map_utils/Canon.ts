import * as babylon from "@babylonjs/core";
import { ObjectSpawnerMessage, Position, Rotation } from "../../types_transfert.js";
import { COLORS3, CANON_DIMENSION } from "../../settings/values.js";

class Canon {
	private readonly canon: babylon.Mesh;
	private readonly id: number;

	constructor(scene: babylon.Scene, id: number, stun: "spin" | "normal") {
		this.canon = babylon.MeshBuilder.CreateBox("canon", { width: CANON_DIMENSION.x, height: CANON_DIMENSION.y, depth: CANON_DIMENSION.z }, scene);
		this.canon.renderingGroupId = 1;
		this.changeMaterial(scene, stun);
		this.id = id;
	}

	private changeMaterial(scene: babylon.Scene, stun: "spin" | "normal"): void {
		const material = new babylon.StandardMaterial('ballcolor', scene);
		if (stun === "spin")
			material.emissiveColor = COLORS3.playerEmissiveSpinEffectFace;
		else
			material.emissiveColor = COLORS3.playerEmissiveNormalFace;
		this.canon.material?.dispose();
		this.canon.material = material;
	}

	update(scene: babylon.Scene, message: ObjectSpawnerMessage): void {
		this.updatePosition(message.position);
		this.updateRotation(message.rotation);
		this.changeMaterial(scene, message.stun);
	}

	private updatePosition(position: Position): void {
		this.canon.position.x = position.x;
		this.canon.position.y = position.y;
		this.canon.position.z = position.z;
	}

	private updateRotation(rotation: Rotation): void {
		if (!this.canon.rotationQuaternion)
			this.canon.rotationQuaternion = new babylon.Quaternion(rotation.x, rotation.y, rotation.z, rotation.w);
		this.canon.rotationQuaternion.set(rotation.x, rotation.y, rotation.z, rotation.w);
	}

	destroy(): void {
		this.canon.material?.dispose();
		this.canon?.dispose();
	}
}

export { Canon };
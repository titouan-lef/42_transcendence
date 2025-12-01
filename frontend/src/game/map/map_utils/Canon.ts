import * as babylon from "@babylonjs/core";
import { Position } from "../../types_transfert.js";
import { COLORS3 } from "../../settings/values.js";

const CANON_DIMENSION = new babylon.Vector3(3, 3, 6);

class Canon {
	private readonly canon: babylon.Mesh;
	private readonly id: number;

	constructor(scene: babylon.Scene, id: number) {
		this.canon = babylon.MeshBuilder.CreateBox("canon", { width: CANON_DIMENSION.x, height: CANON_DIMENSION.y, depth: CANON_DIMENSION.z }, scene);
		this.canon.renderingGroupId = 1;
		this.setMaterial(scene);
		this.id = id;
	}

	private setMaterial(scene: babylon.Scene): void {
		const material = new babylon.StandardMaterial('ballcolor', scene);
		material.emissiveColor = COLORS3.cyan;
		this.canon.material = material;
	}

	updatePosition(position: Position): void {
		this.canon.position.x = position.x;
		this.canon.position.y = position.y;
		this.canon.position.z = position.z;
	}

	destroy(): void {
		this.canon.material?.dispose();
		this.canon?.dispose();
	}
}

export { Canon };
import { PlanePosition } from "#shared/types_transfert";
import { Vector3 } from "@babylonjs/core";

function planePosToVec3(pp: PlanePosition): Vector3 {
	return new Vector3(pp.x, 0, pp.z);
}

export { planePosToVec3 };

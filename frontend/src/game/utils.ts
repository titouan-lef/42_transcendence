import { Vector3 } from "@babylonjs/core";
import { PlanePosition } from "./types_transfert";

function planePosToVec3(pp: PlanePosition): Vector3 {
	return new Vector3(pp.x, 0, pp.z);
}

export { planePosToVec3 };

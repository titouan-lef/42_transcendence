import { Vector3 } from "@babylonjs/core";
import { PlanePosition, Position } from "#shared/types_transfert";

function vec3ToPos(vector: Vector3): Position {
	return {
		x: vector.x,
		y: vector.y,
		z: vector.z
	};
}

function planePosToVec3(pp: PlanePosition): Vector3 {
	return new Vector3(pp.x, 0, pp.z);
}

function randomBoolean() : boolean {
	return Boolean(Math.random());
}

export { vec3ToPos, planePosToVec3, randomBoolean };

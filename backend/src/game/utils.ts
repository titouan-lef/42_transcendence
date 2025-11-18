import { Vector3 } from "@babylonjs/core";
import { Position } from "../web_sockets/types_transfert";

function vec3ToPos(vector: Vector3): Position {
	return {
		x: vector.x,
		y: vector.y,
		z: vector.z
	};
}

export { vec3ToPos };
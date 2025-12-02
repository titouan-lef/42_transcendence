import { AttackAi, Brain, Movement } from "../Brain.js";
import * as babylon from "@babylonjs/core";

class DefaultBrain extends Brain {
	protected intersectionTop(movement: Movement): number {
		const line = new babylon.Vector3 (
			movement.dir.y,
			-movement.dir.x,
			movement.dir.x * movement.pos.y - movement.dir.y * movement.pos.x
		);

		if (movement.dir.x >= 0)
			return 0;
		const sidePos = (movement.dir.y > 0) ? Brain.RIGHT_HEIGHT : Brain.LEFT_HEIGHT;
		const intersectSide = this.intersection(line, sidePos);
		if (intersectSide === null) {
			const intersectTop = this.intersection(line, Brain.TOP_WIDTH);
			if (intersectTop === null)
				return 0;
			this.chooseAtkDirection(movement.dir.y);
			return intersectTop.y;
		}
		movement.pos = intersectSide;
		movement.dir.y *= -1;
		return this.intersectionTop(movement);
	}

	private intersection(line1: babylon.Vector3, line2: babylon.Vector3): babylon.Vector2 | null {
		const denominator = line1.x * line2.y - line2.x * line1.y;
		if (denominator === 0)
			return null;
		const inter = new babylon.Vector2(
			(line1.y * line2.z - line2.y * line1.z) / denominator,
			(line1.z * line2.x - line2.z * line1.x) / denominator
		);
		if (Math.abs(inter.x) > Brain.HALF_HEIGHT || Math.abs(inter.y) > Brain.HALF_WIDTH)
			return null;
		return inter;
	}

	private chooseAtkDirection(moveDirY: number): void {
		if (moveDirY === 0)
			return;
		this.atkDirection = (moveDirY > 0 ) ? AttackAi.RIGHT : AttackAi.LEFT;
	}
}

export { DefaultBrain };

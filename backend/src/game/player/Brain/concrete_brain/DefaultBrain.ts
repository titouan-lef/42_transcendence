import { AttackAi, Brain, Movement } from "../Brain.js";
import * as babylon from "@babylonjs/core";

class DefaultBrain extends Brain {
	protected intersectionTop(movement: Movement): number {
		if (movement.dir.x >= 0)
			return 0;
		if (movement.isSpinningLeft || movement.isSpinningRight)
			return this.spinIntersection(movement);
		else
			return this.intersectionTopNoEffect(movement);
	}

	private spinIntersection(movement: Movement): number {
		const vecForce = (movement.isSpinningRight) ? new babylon.Vector2(movement.dir.y, -movement.dir.x) : new babylon.Vector2(-movement.dir.y, movement.dir.x);
		const vecForceNormalize = vecForce.normalize();
		const dirNormalize = movement.dir.normalize();
		const coeff = 1.3;
		movement.dir = new babylon.Vector2(dirNormalize.x, (coeff * vecForceNormalize.y + dirNormalize.y) / 2);
		return this.intersectionTopNoEffect(movement);
	}

	private intersectionTopNoEffect(movement: Movement): number {
		const sideEquation = (movement.dir.y > 0) ? Brain.EQ_RIGHT_SIDE : Brain.EQ_LEFT_SIDE;
		const ballTrajectory = this.getLineEquation(movement);
		const intersectSide = this.intersection(ballTrajectory, sideEquation);
		if (intersectSide === null) {
			const intersectTop = this.intersection(ballTrajectory, Brain.EQ_TOP);
			if (intersectTop === null)
				return 0;
			this.chooseAtkDirection(movement.dir.y);
			return intersectTop.y;
		}
		movement.pos = intersectSide;
		movement.dir.y *= -1;
		return this.intersectionTopNoEffect(movement);
	}

	private getLineEquation(movement: Movement): babylon.Vector3 {
		return new babylon.Vector3 (
			movement.dir.y,
			-movement.dir.x,
			movement.dir.x * movement.pos.y - movement.dir.y * movement.pos.x
		);
	}

	private intersection(line1: babylon.Vector3, line2: babylon.Vector3): babylon.Vector2 | null {
		const denominator = line1.x * line2.y - line2.x * line1.y;
		if (denominator === 0)
			return null;
		const interX = (line1.y * line2.z - line2.y * line1.z) / denominator;
		const interY = (line1.z * line2.x - line2.z * line1.x) / denominator;
		const inter = new babylon.Vector2(interX, interY);
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

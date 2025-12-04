import * as babylon from "@babylonjs/core";
import { MAP_SIZE, PLAYER_DIMENSION, WALL_WIDTH } from "../../settings/values.js";
import { BallTemplate } from "../../ball/BallTemplate.js";
import { round } from "../../../utils/math.js";

enum DestinationAi { LEFT, RIGHT, REACHING };
enum AttackAi { LEFT, RIGHT, WAIT };

interface Movement {
	pos: babylon.Vector2;
	dir: babylon.Vector2;
	isSpinningLeft: boolean;
	isSpinningRight: boolean;
}

interface ActionAi {
	mov_left: boolean;
	mov_right: boolean;
	atk_left: boolean;
	atk_right: boolean;
}

abstract class Brain {
	// Size constant.
	static readonly HALF_WIDTH = MAP_SIZE.z / 2;
	static readonly HALF_HEIGHT = MAP_SIZE.x / 2 - WALL_WIDTH - PLAYER_DIMENSION.z;

	// Line equation.
	static readonly EQ_LEFT_SIDE = new babylon.Vector3(0, -1, -this.HALF_WIDTH );
	static readonly EQ_RIGHT_SIDE = new babylon.Vector3(0, -1, this.HALF_WIDTH );
	static readonly EQ_TOP = new babylon.Vector3(1, 0, this.HALF_HEIGHT );

	protected atkDirection: AttackAi;
	private destination: DestinationAi;
	private ballZPredict: number;

	protected abstract intersectionTop(movement: Movement): number;

	constructor() {
		this.destination = DestinationAi.REACHING;
		this.atkDirection = AttackAi.WAIT;
		this.ballZPredict = 0;
	}

	refreshView(ball: BallTemplate | null): void {
		this.atkDirection = AttackAi.WAIT;
		if (ball === null || ball.getGoal()) {
			this.ballZPredict = 0;
			return;
		}
		const mouvement = this.getBallMovement(ball);
		const zPos = this.intersectionTop(mouvement);
		this.ballZPredict = round(zPos, 1);
	}

	private getBallMovement(ball: BallTemplate): Movement {
		const ballPosition = ball.getPosition();
		const ballDirection = ball.getDirection();
		return {
			pos: new babylon.Vector2(ballPosition.x, ballPosition.z),
			dir: new babylon.Vector2(ballDirection.x, ballDirection.z),
			isSpinningLeft: ball.isSpinningLeft(),
			isSpinningRight: ball.isSpinningRight()
		};
	}

	getAction(aiPosZ: number): ActionAi {
		this.defineDestination(aiPosZ);
		return this.applyAction();
	}

	private defineDestination(aiPosZ: number): void {
		const distanceDestination = Math.abs(this.ballZPredict - aiPosZ);
		if (distanceDestination < PLAYER_DIMENSION.z / 4) {
			this.destination = DestinationAi.REACHING;
			return;
		}
		this.destination = (this.ballZPredict < aiPosZ) ? DestinationAi.RIGHT : DestinationAi.LEFT;
	}

	private applyAction(): ActionAi {
		const action = this.getDefaultAction();
		switch (this.destination) {
			case DestinationAi.LEFT:
				action.mov_left = true;
				break;
			case DestinationAi.RIGHT:
				action.mov_right = true;
				break;
			case DestinationAi.REACHING:
				this.applyActionDestReaching(action);
				break;
			default:
				throw new Error("AI switch destination");
		}
		return action;
	}

	private getDefaultAction(): ActionAi {
		return {
			mov_left: false,
			mov_right: false,
			atk_left: false,
			atk_right: false,
		};
	}

	private applyActionDestReaching(action: ActionAi): void {
		switch (this.atkDirection) {
			case AttackAi.LEFT:
				action.atk_left = true;
				break;
			case AttackAi.RIGHT:
				action.atk_right = true;
				break;
			case AttackAi.WAIT:
				break;
			default:
				throw new Error("AI switch destination");
		}
	}
}

export { Brain, ActionAi, AttackAi, Movement };

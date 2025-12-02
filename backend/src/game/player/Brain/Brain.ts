import * as babylon from "@babylonjs/core";
import { MAP_SIZE, PLAYER_DIMENSION, WALL_WIDTH } from "../../settings/values.js";
import { BallTemplate } from "../../ball/BallTemplate.js";

enum DestinationAi { LEFT, RIGHT, REACHING };
enum AttackAi { LEFT, RIGHT, WAIT };

interface Movement {
	pos: babylon.Vector2;
	dir: babylon.Vector2;
}

interface ActionAi {
	mov_left: boolean;
	mov_right: boolean;
	atk_left: boolean;
	atk_right: boolean;
}

abstract class Brain {
	static readonly HALF_WIDTH = MAP_SIZE.z / 2;
	static readonly HALF_HEIGHT = MAP_SIZE.x / 2 - WALL_WIDTH - PLAYER_DIMENSION.z;

	static readonly LEFT_HEIGHT = new babylon.Vector3(0, -1, -this.HALF_WIDTH );
	static readonly RIGHT_HEIGHT = new babylon.Vector3(0, -1, this.HALF_WIDTH );
	static readonly TOP_WIDTH = new babylon.Vector3(1, 0, this.HALF_HEIGHT );

	protected atkDirection: AttackAi;
	private ballToWatch: BallTemplate | null = null;
	private destination: DestinationAi;
	private ballPosPredict: number;

	protected abstract intersectionTop(movement: Movement): number;

	constructor() {
		this.ballToWatch = null;
		this.destination = DestinationAi.REACHING;
		this.atkDirection = AttackAi.WAIT;
		this.ballPosPredict = 0;
	}

	refreshView(): void {
		this.atkDirection = AttackAi.WAIT;
		if (this.ballToWatch === null) {
			this.ballPosPredict = 0;
			return;
		}
		const ballPosition = this.ballToWatch.getPosition();
		const ballDirection = this.ballToWatch.getDirection();
		const mouvement: Movement = {
			pos: new babylon.Vector2(ballPosition.x, ballPosition.z),
			dir: new babylon.Vector2(ballDirection.x, ballDirection.z)
		};
		const zPos = this.intersectionTop(mouvement);
		this.ballPosPredict = Math.round(zPos * 10) / 10;
		console.log("Me: " + this.ballPosPredict);
	}

	setBallToWatch(ball: BallTemplate): void {
		this.ballToWatch = ball;
	}

	getAction(aiPosZ: number): ActionAi {
		this.defineDestination(aiPosZ);
		return this.applyAction();
	}

	private defineDestination(aiPosZ: number): void {
		const distanceDestination = Math.abs(this.ballPosPredict - aiPosZ);
		if (distanceDestination < PLAYER_DIMENSION.z / 4) {
			this.destination = DestinationAi.REACHING;
			return;
		}
		if (this.ballPosPredict < aiPosZ)
			this.destination = DestinationAi.LEFT;
		else
			this.destination = DestinationAi.RIGHT;
	}

	private applyAction(): ActionAi {
		const action: ActionAi = this.getDefaultAction();
		switch (this.destination) {
			case DestinationAi.LEFT:
				action.mov_left = true;
				break;
			case DestinationAi.RIGHT:
				action.mov_right = true;
				break;
			case DestinationAi.REACHING:
				if (this.atkDirection === AttackAi.LEFT)
					action.atk_left = true;//this.wantToShootLeft = true;
				else if (this.atkDirection === AttackAi.RIGHT)
					action.atk_right = true;
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
}

export { Brain, ActionAi, AttackAi, Movement };


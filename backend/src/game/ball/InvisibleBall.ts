import * as babylon from "@babylonjs/core";
import { BallTemplate } from "./BallTemplate.js";
import { INVISIBLE_BALL_FADING_INTERVAL, INVISIBLE_BALL_INVISIBILITY_INTERVAL, INVISIBLE_BALL_LOOSING_VISIBILITY_INTERVAL } from "../settings/values.js";
import { WebSocket } from "ws";

class InvisibleBall extends BallTemplate {
	constructor(scene: babylon.Scene, sockets: WebSocket[], windAffected: boolean) {
		super(scene, "invisible", sockets, windAffected);
	}
	
	activateEffect(): void {
		const resetTimer = INVISIBLE_BALL_FADING_INTERVAL + INVISIBLE_BALL_LOOSING_VISIBILITY_INTERVAL + INVISIBLE_BALL_INVISIBILITY_INTERVAL;
		this.effectInterval++;
		if (this.effectInterval >= INVISIBLE_BALL_FADING_INTERVAL) {
			if (this.effectInterval >= resetTimer)// gain visibility after being invisible for a certain time
				this.mesh.visibility += 1 / INVISIBLE_BALL_LOOSING_VISIBILITY_INTERVAL;
			else if (this.mesh.visibility > 0) // looses visibility
				this.mesh.visibility -= 1 / INVISIBLE_BALL_LOOSING_VISIBILITY_INTERVAL;

			if (this.effectInterval >= resetTimer && this.mesh.visibility >= 1) { // reset timer
				this.mesh.visibility = 1;
				this.effectInterval -= resetTimer + INVISIBLE_BALL_LOOSING_VISIBILITY_INTERVAL;
			}
		}
	}
}

export { InvisibleBall };

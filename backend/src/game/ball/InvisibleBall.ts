import * as babylon from "@babylonjs/core";
import { BallTemplate } from "./BallTemplate.js";
import { COLORS3, INVISIBLE_BALL_FADING_INTERVAL, INVISIBLE_BALL_INVISIBILITY_INTERVAL, INVISIBLE_BALL_LOOSING_VISIBILITY_INTERVAL } from "../settings/values.js";
import { WebSocket } from "ws";
import { GameSettings } from "../settings/GameSettings.js";

class InvisibleBall extends BallTemplate {
	constructor(scene: babylon.Scene, sockets: WebSocket[], settings: GameSettings) {
		super(scene, "invisible", sockets, settings);
		this.particleColor = COLORS3.magenta;
	}
	
	activateEffect(): void {
		const resetTimer = INVISIBLE_BALL_FADING_INTERVAL + INVISIBLE_BALL_LOOSING_VISIBILITY_INTERVAL + INVISIBLE_BALL_INVISIBILITY_INTERVAL;
		if (this.effectInterval < INVISIBLE_BALL_FADING_INTERVAL)
			return ;
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

export { InvisibleBall };
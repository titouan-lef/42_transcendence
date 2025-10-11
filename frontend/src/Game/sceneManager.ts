import { BallTemplate, DefaultBall, HeavyBall, InvisibleBall, SnakeBall, TrickyBall } from "./ballTemplate.js";
import { MapTemplate, DefaultMap, VolcanoMap, WindyMap, FrozenMap, RainyMap} from "./mapTemplate.js";
import { GameSettings, MapOption, BallOption } from "./gameSettings.js";

export class SceneManager {
	balls: BallTemplate[] = [];
	maps: MapTemplate[] = [];

	destroyAll(): void {
		this.destroyBalls();
		this.destroyMaps();
	}

	destroyBalls(): void {
		this.balls.forEach(ball => ball.destroy());
	}

	destroyMaps(): void  {
		this.maps.forEach(map => map.destroy());
	}

	addBall(ball: BallTemplate): void  {
		this.balls.push(ball);
	}

	addMap(map: MapTemplate): void  {
		this.maps.push(map);
	}
}
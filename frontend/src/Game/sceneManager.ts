import { BallTemplate} from "./ballTemplate.js";
import { MapTemplate} from "./mapTemplate.js";
import { Player } from "./player.js";


export class SceneManager {
	readonly balls: BallTemplate[] = [];
	readonly maps: MapTemplate[] = [];
	readonly players: Player[] = [];

	addBall(ball: BallTemplate): void  {
		this.balls.push(ball);
	}
	
	addMap(map: MapTemplate): void  {
		this.maps.push(map);
	}
	
	addPlayers(player1: Player, player2: Player): void{
		this.players.push(player1);
		this.players.push(player2); 
	}

	destroyAll(): void {
		this.destroyBalls();
		this.destroyMaps();
		this.destroyPlayers();
	}

	destroyBalls(): void {
		this.balls.forEach(ball => ball.destroy());
	}

	destroyMaps(): void  {
		this.maps.forEach(map => map.destroy());
	}

	destroyPlayers(): void{
		this.players.forEach(player => player.destroy());
	}
}
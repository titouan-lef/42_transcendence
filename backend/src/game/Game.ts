import * as babylon from "@babylonjs/core";
import { SceneManager } from "./scene/SceneManager.js";
import { GameSettings } from "./settings/GameSettings.js";
import { HavokPlugin } from "@babylonjs/core/Physics/index.js";
import havokPhysics from "@babylonjs/havok";
import { GAME_STEP_INTERVAL, PHYSIC_STEP_INTERVAL, POINTS_TO_WIN, SHOW_DISPOSE_LOGS } from "./settings/values.js";
import fs from "fs";
import { BallOption, MapOption, Status, PositionsMessage, StartMessage, StopMessage, OptionMessage, GoalMessage, GameStats, Point } from "#shared/types_transfert.js";
import { Player } from "./player/Player.js";
import { Human } from "./player/Human.js";
import { stopGame } from "./game_manager.js";
import { getCurrentSeason } from "../database/season.js";
import { insertGame } from "../database/game.js";
import { getPlayerGamesBySeason, insertGoal } from "../database/goal.js";
import { getBallId } from "../database/ball.js";
import { getMapId } from "../database/map.js";
import { insertGameRule } from "../database/game_rule.js";
import { getRuleId } from "../database/rule.js";

class Game {
	private readonly id: number;
	private readonly engine: babylon.Engine;
	private readonly scene: babylon.Scene;
	private readonly sceneManager: SceneManager;
	private readonly settings: GameSettings;
	private readonly camera: babylon.ArcRotateCamera; // the engine need a camera
	private gameStepsIntervalId?: ReturnType<typeof setInterval>;
	private gameStepsInterval = GAME_STEP_INTERVAL;
	private physicStepsIntervalId?: ReturnType<typeof setInterval>;
	private physicStepsInterval = PHYSIC_STEP_INTERVAL;
	private inAnimation = false;
	private score: babylon.Vector2;
	private gameTimerIntervalId: ReturnType<typeof setInterval>;
	private gameTimer = 0;
	private readonly points: Point[] = [];
	private gameIdDb?: number;
	private gameStopped = false;

	constructor (id: number, settings: GameSettings, scene: babylon.Scene, engine: babylon.Engine) {
		this.id = id;
		this.engine = engine;
		this.settings = settings;
		this.camera = new babylon.ArcRotateCamera("Camera", 0, 0, 0, babylon.Vector3.Zero(), scene);
		this.sceneManager = new SceneManager(scene, settings);
		this.scene = scene;
		this.scene.metadata = { gameSpeed: 1 };
		this.score = new babylon.Vector2(0, 0);
		this.setScene();
		this.gameTimerIntervalId = setInterval(() => {
			this.gameTimer++;
		}, 1000);
	}

	/** returning the constructor because we cant do an async constructor and create() will have to wait for havok.engine to start */
	static async create(id: number, settings: GameSettings): Promise<Game> {
		const engine =  new babylon.NullEngine();
		const scene = await Game.initScene(engine);

		return new Game(id, settings, scene, engine);
	}

	private async insertGameInDb(): Promise<void> {
		const currentSeason = await getCurrentSeason();
		if (!currentSeason)
			return ;
		this.gameIdDb = await insertGame(currentSeason, this.gameTimer);
		if (!this.gameIdDb)
			return ;
		
		const spinRuleId = await getRuleId("spin");
		const rotateRuleId = await getRuleId("rotate");
		const windRuleId = await getRuleId("wind");
		const dashRuleId = await getRuleId("dash");
		const canonCountRuleId = await getRuleId("canonCount");
		if (!spinRuleId || !rotateRuleId || !windRuleId || !dashRuleId || !canonCountRuleId)
			throw new Error("Error while creating rules");
		await insertGameRule(this.gameIdDb, spinRuleId, this.settings.options.spin);
		await insertGameRule(this.gameIdDb, rotateRuleId, this.settings.options.rotatingPlayer);
		await insertGameRule(this.gameIdDb, windRuleId, this.settings.options.windAffectsBall);
		await insertGameRule(this.gameIdDb, dashRuleId, this.settings.options.dashingPlayer);
		await insertGameRule(this.gameIdDb, canonCountRuleId, this.settings.options.canonCount);
	}

	private static async initScene(engine: babylon.Engine): Promise<babylon.Scene> {
		const scene = new babylon.Scene(engine);
		const nodeBuffer = fs.readFileSync("/app/node_modules/@babylonjs/havok/lib/esm/HavokPhysics.wasm");
		const wasmBinary = nodeBuffer.buffer.slice(nodeBuffer.byteOffset, nodeBuffer.byteOffset + nodeBuffer.byteLength);
		const havokInstance = await havokPhysics({ wasmBinary });
		const havokPlugin = new HavokPlugin(true, havokInstance);
		scene.enablePhysics(new babylon.Vector3(0, -9.81, 0), havokPlugin);
		return scene;
	};

	start(): void {
		this.startRender();
		this.startGameCommunication();
	}

	/**@todo usefull ? */
	pause(): void {
		if (this.gameStepsIntervalId)
			clearInterval(this.gameStepsIntervalId);
		if (this.physicStepsIntervalId)
			clearInterval(this.physicStepsIntervalId);
	}

	async stop(): Promise<void> {
		if (this.gameStopped) /**@todo si vous voulez trouver mieux, MAIS C PAS MOI QUI LE FERAIS */
			return ;
		this.gameStopped = true;
		if (this.settings.isRanked) {
			await this.insertGameInDb();
			for (const point of this.points) {
				await this.insertPointInDb(point);
			};
			await this.updateElos();
		}
		clearInterval(this.gameTimerIntervalId);
		this.stopSendingPositions();
		this.sceneManager.destroyScene();
		this.scene.onAfterRenderObservable.clear();
		this.camera.dispose();
		if (SHOW_DISPOSE_LOGS)
			this.sceneManager.showDisposeLogs(this.scene);
		this.scene.dispose();
		this.engine.dispose();
	}

	private async updateElos(): Promise<void> {
		for (let i = 1; i <= 2; i++) {
			const player = this.sceneManager.getPlayer(i)?.getName();
			const seasonId = await getCurrentSeason();
			if (!seasonId || !player)
				return ;
			const playerGamesBySeason = await getPlayerGamesBySeason(seasonId, player);
			console.log(player + " has won " + playerGamesBySeason + " games this season.");
			// if (playerGamesBySeason == 10) {
			// 	if (hasElo(player))
			// 		defineEloNewPlayer();
			// 	else
			// 		updateEloNewSeason();
			// } else if (playerGamesBySeason > 10){
			// 	updateEloAfterGame()
			// }
		}
	}

	private setScene(): void {
		this.sceneManager.createPlayers(this.scene, this.settings);
		this.sceneManager.setEnvironnement(this.scene, this.settings);
		this.scene.onAfterRenderObservable.add(() => {
			if (this.inAnimation === false)
				this.checkEndOfPoint();
		});
	}

	private storePoint(goalerId: 1 | 2, ball: BallOption, map: MapOption): void {
		const currentPoint = {
			ball: ball,
			map: map,
			timer: this.gameTimer,
			goaler: goalerId
		};
		this.points.push(currentPoint);
	}

	private async insertPointInDb(point: Point): Promise<void> {
		const mapIdDb = await getMapId(point.map);
		const ballIdDb = await getBallId(point.ball);
		const goalerName = this.sceneManager.getPlayer(point.goaler)?.getName();
		if (!ballIdDb || !mapIdDb || !goalerName || !this.gameIdDb)
			return;
		insertGoal(mapIdDb, ballIdDb, goalerName, point.timer, this.gameIdDb);
	}	

	/**check collision for each balls */
	async checkEndOfPoint(): Promise<void> {
		const goalInfos = this.sceneManager.checkGoal();
		if (goalInfos) {
			const ball = this.sceneManager.getBall()?.getType();
			if (!ball)
				return ;
			this.inAnimation = true;
			this.changeGameSpeed(0.1);
			await this.sceneManager.goalAnimation();
			if (this.sceneManager.doesGameEnded()) // if closing game while animation
				return;
			this.changeGameSpeed(1);
			goalInfos === "player1" ? this.score.x += 1 : this.score.y += 1;
			const map = this.sceneManager.getMapType();
			this.storePoint(goalInfos === "player1" ? 1 : 2, ball, map);
			this.sendScore();
			if (this.score.x === POINTS_TO_WIN || this.score.y === POINTS_TO_WIN) {
				await stopGame(this.id);
			} else {
				this.inAnimation = false;
				this.sceneManager.destroyEnvironnement();
				if (SHOW_DISPOSE_LOGS)
					this.sceneManager.showDisposeLogs(this.scene);
				this.sceneManager.setEnvironnement(this.scene, this.settings);
				const player1 = this.sceneManager.getPlayer(1);
				const player2 = this.sceneManager.getPlayer(2);
				if (!player1 || !player2)
					return;
				this.sendOptions(player1, player2);
			}
		}
	}

	private getPositions(player: Player, enemy: Player): PositionsMessage | null {
		const ball = this.sceneManager.getBall();
		let ballPosition;
		let ballVisibility;
		if (!ball) {
			ballPosition = { x: 0, y: 0, z: 0 };
			ballVisibility = 0;
		} else{
			ballPosition = ball.getPosition();
			ballVisibility = ball.getVisibility();
		}

		const positions: PositionsMessage = {
			status: Status.POSITIONS,
			ball: ballPosition,
			ballVisibility: ballVisibility,
			player: player.getPosition(),
			playerRotation: player.getRotation(),
			playerStunned: player.isStunned(),
			enemy: enemy.getPosition(),
			enemyRotation: enemy.getRotation(),
			enemyStunned: enemy.isStunned(),
		};
		return positions;
	}

	private sendPositions(player1: Player, player2: Player) : void {
		const positionP1 = this.getPositions(player1, player2);
		if (positionP1)
			player1.send(positionP1);
		const positionP2 = this.getPositions(player2, player1);
		if (positionP2)
			player2.send(positionP2);
	}

	private sendStart(player1: Player, player2: Player) : void {
		const startP1: StartMessage = {
			status: Status.START,
			playerName: player1.getName(),
			enemyName: player2.getName()
		};
		player1.send(startP1);
		const startP2: StartMessage = {
			status: Status.START,
			playerName: player2.getName(),
			enemyName: player1.getName()
		};
		player2.send(startP2);
	}

	private sendStop(player1: Player, player2: Player) : void {
		const stop: StopMessage = {
			status: Status.STOP,
			gameStats: this.createStats()
		};
		player1.send(stop);
		player2.send(stop);
	}

	private createStats(): GameStats {
		const player1 = {
			name: this.settings.player1.username,
			score: this.score.x
		};
		const player2name = this.settings.player2 ? this.settings.player2.username : "IA";
		const player2 = {
			name: player2name,
			score: this.score.y
		};
		const rules = {
			ballOptions: this.settings.options.ball,
			mapOptions: this.settings.options.map,
			rotatingPlayer: this.settings.options.rotatingPlayer,
			spin: this.settings.options.spin,
			dashingPlayer: this.settings.options.dashingPlayer,
			windAffectsBall: this.settings.options.windAffectsBall,
			canonCount: this.settings.options.canonCount
		};
		const gameStats = {
			player1: player1,
			player2: player2,
			gameTimer: this.gameTimer,
			points: this.points,
			rules: rules
		};
		return gameStats;
	}

	private sendOptions(player1: Player, player2: Player) : void {
		const options: OptionMessage = {
			status: Status.OPTIONS,
			playerId: 1,
			map: this.sceneManager.getMapType(),
			wind: this.sceneManager.getWind(),
			ball: "default",
			rotatingPlayer: this.settings.options.rotatingPlayer,
			spin: this.settings.options.spin,
			dashingPlayer: this.settings.options.dashingPlayer,
			canonCount: this.settings.options.canonCount
		};

		const ball = this.sceneManager.getBall();
		if (ball)
			options.ball = ball.getType();

		player1.send(options);
		options.playerId = 2;
		player2.send(options);
	}

	private sendScore() : void {
		const player1 = this.sceneManager.getPlayer(1);
		const player2 = this.sceneManager.getPlayer(2);
		if (!player1 || !player2)
			return;

		const scoreP1: GoalMessage = {
			status: Status.GOAL,
			player: this.score.x,
			enemy: this.score.y
		};
		player1.send(scoreP1);
		const scoreP2: GoalMessage = {
			status: Status.GOAL,
			player: this.score.y,
			enemy: this.score.x
		};
		player2.send(scoreP2);
	}

	private changeGameSpeed(newSpeed: number): void {
		this.scene.metadata.gameSpeed = newSpeed;
	}

	startRender(): void {
		this.physicStepsIntervalId = setInterval(() => {
			const physics = this.scene.getPhysicsEngine();
			if (physics)
				physics._step(this.physicStepsInterval / 1000 * this.scene.metadata.gameSpeed);
		}, this.physicStepsInterval);
		
		this.gameStepsIntervalId = setInterval(() => {
			this.scene.render();
			const player1 = this.sceneManager.getPlayer(1);
			const player2 = this.sceneManager.getPlayer(2);
			if (!player1 || !player2)
				return;
			this.sendPositions(player1, player2);
		}, this.gameStepsInterval);
	}

	private incrementPointsToMax(leaverId: 1 | 2): void {
		if (leaverId === 1) {
			while(this.score.y < POINTS_TO_WIN) {
				this.score.y++;
				this.storePoint(2, "default", "default");
			}
		} else {
			while(this.score.x < POINTS_TO_WIN) {
				this.score.x++;
				this.storePoint(1, "default", "default");
			}
		}
	}

	private defineCloseAction(leaver: Player, stayer: Player): void {
		if (leaver instanceof Human) {
			leaver.defineCloseAction(async () => {
				const leaverId = leaver.getId();
				this.incrementPointsToMax(leaverId);
				await stopGame(this.id);
				if (stayer instanceof Human) {
					stayer.closeSocket();
				}
			});
		}
	}

	startGameCommunication(): void {
		const player1 = this.sceneManager.getPlayer(1);
		const player2 = this.sceneManager.getPlayer(2);
		if (!player1 || !player2)
			return;
		this.sendStart(player1, player2);
		this.sendOptions(player1, player2);
		this.sendPositions(player1, player2);

		this.defineCloseAction(player1, player2);
		this.defineCloseAction(player2, player1);
	}

	stopSendingPositions(): void {
		if (!this.gameStepsIntervalId)
			return;
		clearInterval(this.physicStepsIntervalId);
		clearInterval(this.gameStepsIntervalId);
		this.gameStepsIntervalId = undefined;

		const player1 = this.sceneManager.getPlayer(1);
		const player2 = this.sceneManager.getPlayer(2);
		if (!player1 || !player2)
			return;
		this.sendStop(player1, player2);
	}
}

export { Game };

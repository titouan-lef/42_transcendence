import * as babylon from "@babylonjs/core";
import { SceneManager } from "./scene/SceneManager.js";
import { GameSettings, PlayerSettings } from "./settings/GameSettings.js";
import { HavokPlugin } from "@babylonjs/core/Physics/index.js";
import havokPhysics from "@babylonjs/havok";
import { GAME_STEP_INTERVAL, PHYSIC_STEP_INTERVAL, POINTS_TO_WIN } from "./settings/values.js";
import fs from "fs";
import { BallOption, MapOption, Status, PositionsMessage, StartMessage, StopMessage, OptionMessage, GoalMessage, GameStats, Point } from "#shared/types_transfert.js";
import { Player } from "./player/Player.js";
import { Human } from "./player/Human.js";
import { stopGame } from "./game_manager.js";
import { getCurrentSeason } from "../database/season.js";
import { insertGame } from "../database/game.js";
import { insertGoal } from "../database/goal.js";
import { getBallId } from "../database/ball.js";
import { getMapId } from "../database/map.js";
import { insertGameRule } from "../database/game_rule.js";
import { getRuleId } from "../database/rule.js";
import { calculateOutcome } from "../tournament/elo/elo.js";
import { updateElo } from "../tournament/elo/elo_update.js";
import { getAllRatingBySeason } from "../database/web3/contract_service.js";
import { getUserByUsername } from "../database/user.js";
import { GUEST_NAME } from "#shared/constant.js";

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

	async stop(): Promise<void> {
		if (this.gameStopped)
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
		await this.stopSendingPositions();
		this.sceneManager.destroyScene();
		this.scene.onAfterRenderObservable.clear();
		this.camera.dispose();
		this.scene.dispose();
		this.engine.dispose();
	}

	isUserPlaying(user: string): boolean {
		if (this.settings.player1.username === user)
			return true;
		if (this.settings.player2?.username === user)
			return true;
		return false;
	}

	private async updateElos(): Promise<void> {
		const player1 = this.sceneManager.getPlayer(1)?.getName();
		const player2 = this.sceneManager.getPlayer(2)?.getName();
		const eloP1 = this.settings.player1.elo;
		const eloP2 = this.settings.player2?.elo;
		const outcome = calculateOutcome(this.score.x, this.score.y);
		if (!player1 || !player2 || !this.gameIdDb || !eloP1 || !eloP2)
			return;
		updateElo(player1, eloP1, player2, eloP2, outcome, this.gameIdDb);
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

	private async sendStart(player1: Player, player2: Player) : Promise<void> {
		try {
			const season = await getCurrentSeason();
			const player1Name: string = player1.getName();
			const player2Name: string = player2.getName();
			const user1 = await getUserByUsername(player1Name);
			const user2 = await getUserByUsername(player2Name);

			const [rating1, rating2] = await getAllRatingBySeason([player1Name, player2Name], season);

			const startP1: StartMessage = {
				status: Status.START,
				playerNickname: user1 ? user1.nickname : GUEST_NAME,
				playerRating: rating1,
				enemyNickname: user2 ? user2.nickname : GUEST_NAME,
				enemyRating: rating2
			};
			player1.send(startP1);
			const startP2: StartMessage = {
				status: Status.START,
				playerNickname: user2 ? user2.nickname : GUEST_NAME,
				playerRating: rating2,
				enemyNickname: user1 ? user1.nickname : GUEST_NAME,
				enemyRating: rating1
			};
			player2.send(startP2);
		} catch (error) {
			console.error("Failed to send start messages:", error);
		}
	}

	private async sendStop(player1: Player, player2: Player) : Promise<void> {
		const stats1 = await this.createStats(player1);
		if (stats1 !== null) {
			const stop: StopMessage = {
				status: Status.STOP,
				gameStats: stats1
			};
			player1.send(stop);
		}
		const stats2 = await this.createStats(player2);
		if (stats2 !== null) {
			const stop: StopMessage = {
				status: Status.STOP,
				gameStats: stats2
			};
			player2.send(stop);
		}
	}

	private async createStats(receiver: Player): Promise<GameStats | null> {
		let player: PlayerSettings;
		let enemy: PlayerSettings | undefined;
		const isPlayer1 = this.settings.player1.username === receiver.getName();
		if (isPlayer1) {
			player = this.settings.player1;
			enemy = this.settings.player2;
		} else if (this.settings.player2) {
			player = this.settings.player2;
			enemy = this.settings.player1;
		} else
			return null;

		const points: Point[] = [];
		for (const point of this.points) {
			const newPoint = point;
			newPoint.goaler = isPlayer1 ? point.goaler: (point.goaler === 1 ? 2: 1);
			points.push(newPoint);
		}

		const player1 = {
			name: (await getUserByUsername(player.username))?.nickname ?? GUEST_NAME,
			score: isPlayer1? this.score.x: this.score.y
		};
		let player2name: string;
		if (enemy) {
			player2name = (await getUserByUsername(enemy.username))?.nickname ?? GUEST_NAME;
		} else {
			player2name = "AI";
		}
		const player2 = {
			name: player2name,
			score: isPlayer1? this.score.y: this.score.x
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
		const gameStats: GameStats = {
			player1: player1,
			player2: player2,
			gameTimer: this.gameTimer,
			points: points,
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

	async stopSendingPositions(): Promise<void> {
		if (!this.gameStepsIntervalId)
			return;
		clearInterval(this.physicStepsIntervalId);
		clearInterval(this.gameStepsIntervalId);
		this.gameStepsIntervalId = undefined;

		const player1 = this.sceneManager.getPlayer(1);
		const player2 = this.sceneManager.getPlayer(2);
		if (!player1 || !player2)
			return;
		await this.sendStop(player1, player2);
	}
}

export { Game };

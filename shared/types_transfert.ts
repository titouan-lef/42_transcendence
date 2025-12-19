import * as babylon from "@babylonjs/core";

type MapOption = "default" | "volcano" | "sky" | "desert";
type BallOption = "default" | "invisible" | "tricky" | "pulse" | "snake" | "canon";

interface Position {
	x: number;
	y: number;
	z: number;
}

interface Rotation {
	x: number;
	y: number;
	z: number;
	w: number;
}

interface PlanePosition {
	x: number;
	z: number;
}

enum Status {
	START,			// game begins
	STOP,			// game finished
	TIMING,			// countdowns
	RENDER,			// deltaT -> slow motions
	GOAL,			// score
	OPTIONS,		// precise game options
	POSITIONS,		// positions of ball and players
	OBJECT,			// tornados / meteors / thunders
	EVENT,			// particules launcher
	EMOTE,			// emote launcher
	OBJECTSPAWNER	// canon
}

interface StartMessage {
	status: Status.START,
	playerName: string,
	enemyName: string
}

interface Point {
	ball: BallOption,
	map: MapOption,
	timer: number,
	goaler: 1 | 2
}

interface Rules {
	ballOptions: BallOption[],
	mapOptions: MapOption[],
	rotatingPlayer: boolean,
	spin: boolean,
	dashingPlayer: boolean,
	windAffectsBall: boolean,
	canonCount: number
}

interface PlayerInfo {
	name: string,
	score: number
}

interface GameStats {
	player1: PlayerInfo,
	player2: PlayerInfo,
	gameTimer: number,
	points: Point[],
	rules: Rules
}

interface StopMessage {
	status: Status.STOP,
	gameStats: GameStats
}

interface TimingMessage {
	status: Status.TIMING,
	time : number
}

interface RenderMessage {
	status: Status.RENDER,
	deltaMultiplicator: number,
}

interface GoalMessage {
	status: Status.GOAL,
	player: number,
	enemy: number
}

interface OptionMessage {
	status: Status.OPTIONS,
	playerId: 1 | 2;
	map: MapOption;
	wind: PlanePosition; // Vector2
	ball: BallOption;
	rotatingPlayer: boolean;
	spin: boolean;
	dashingPlayer: boolean;
	canonCount: number;
}

interface PositionsMessage {
	status: Status.POSITIONS,
	ball: Position,
	ballVisibility: number,
	player: PlanePosition,
	playerRotation : Rotation,
	playerStunned: boolean,
	enemy: PlanePosition,
	enemyRotation: Rotation,
	enemyStunned: boolean
}

enum Object { LIGHTNING, METEOR, TORNADO, CANON_BALL };
type ParticlesType = "explosion" | "collision" | "impulse";

interface ObjectMessage {
	status: Status.OBJECT,
	type: Object,
	id: number,
	position: Position,
	size: number,
	currentLifetime: number
}

enum ObjectSpawner { CANON };

interface ObjectSpawnerMessage {
	status: Status.OBJECTSPAWNER,
	type: ObjectSpawner,
	id: number,
	position: Position,
	rotation: Rotation,
	currentLifetime: number,
	stun: "spin" | "normal"
}

interface EventMessage {
	status: Status.EVENT,
	type: ParticlesType,
	color: babylon.Color3,
	position: Position,
	size: number
}

enum EmoteChoice { STRONG, SAD, LOL, ANGRY };

interface EmoteMessage {
	status: Status.EMOTE,
	type: EmoteChoice,
	playerid: 1 | 2;
}

type DataMessage = StartMessage | StopMessage | TimingMessage | RenderMessage | GoalMessage | OptionMessage | PositionsMessage | ObjectMessage | EventMessage | EmoteMessage | ObjectSpawnerMessage;

interface PlayerControls {
	mov_right: boolean;
	mov_left: boolean;
	rot_right: boolean;
	rot_left: boolean;
	normalMode: boolean;
	spinMode: boolean;
	emoteStrong: boolean;
	emoteSad: boolean;
	emoteLol: boolean;
	emoteAngry: boolean;
	dash: boolean;
}

export { Position, PlanePosition, Rotation, DataMessage, PlayerControls, ParticlesType, Status, Object, EmoteChoice, ObjectSpawner };
export { StartMessage, StopMessage, TimingMessage, RenderMessage, GoalMessage, OptionMessage, PositionsMessage, ObjectMessage, EventMessage, EmoteMessage, ObjectSpawnerMessage };
export { BallOption, MapOption, GameStats, Point };

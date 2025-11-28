import { BallOption, MapOption } from "../game/settings/GameSettings.js";

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
	EMOTE			// emote launcher
}

interface StartMessage {
	status: Status.START,
	playerName: string,
	enemyName: string
}

interface StopMessage {
	status: Status.STOP
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
}

interface PositionsMessage {
	status: Status.POSITIONS,
	ball: Position,
	ballVisibility: number,
	player: PlanePosition,
	playerRotation : Rotation,
	enemy: PlanePosition,
	enemyRotation: Rotation
}

enum Object { LIGHTNING, METEOR, TORNADO };
type ParticlesType = "explosion" | "collision" | "impulse";

interface ObjectMessage {
	status: Status.OBJECT,
	type: Object,
	id: number,
	position: Position,
	size: number,
	currentLifetime: number
}

interface EventMessage {
	status: Status.EVENT,
	type: ParticlesType,
	position: Position
}

enum EmoteChoice { STRONG, SAD, LOL, ANGRY };

interface EmoteMessage {
	status: Status.EMOTE,
	type: EmoteChoice,
	playerid: 1 | 2;
}

type DataMessage = StartMessage | StopMessage | TimingMessage | RenderMessage | GoalMessage | OptionMessage | PositionsMessage | ObjectMessage | EventMessage | EmoteMessage;

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
}

export { Position, PlanePosition, Rotation, DataMessage, PlayerControls, ParticlesType, Status, Object, EmoteChoice };
export { StartMessage, StopMessage, TimingMessage, RenderMessage, GoalMessage, OptionMessage, PositionsMessage, ObjectMessage, EventMessage, EmoteMessage };

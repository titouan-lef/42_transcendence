import { BallOption, MapOption } from "../game/settings/GameSettings.js";

interface Position {
	x: number;
	y: number;
	z: number
}

interface PlanePosition {
	x: number;
	z: number
}

enum Status {
	START,			// game begins
	STOP,			// game finished
	TIMING,			// countdowns
	GOAL,			// score
	OPTIONS,		// precise game options
	POSITIONS,		// positions of ball and players
	OBJECT,			// tornados / meteors / thunders
	EVENT			// particules launcher
}

/**
 * ------------  DATA FLOW  ------------
 * 
 * new game -> START, OPTIONS, POSITIONS
 * 
 * TIMING (countdown)	<-------------------
 * during rounds:	<-------------------	|
 * 		POSITIONS 						|	|
 * 		OBJECT if any					|	|
 * 		EVENT if any	----------------	|
 * 											|
 * on goal:									|
 * 		GOAL								|
 * 		EVENT (goal -> explosion, pause)	|
 *		OPTIONS if changed					|	(case of random map or ball ?? or is it just define at the begining of the game ?)
 * 		go back to countdown ---------------
 * 
 * end game -> STOP
 * 
 * // client request DASHBOARD in HTTPS //
 */

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

interface GoalMessage {
	status: Status.GOAL,
	player: number,
	enemy: number
}

interface OptionMessage {
	status: Status.OPTIONS,
	playerId: 1 | 2;
	map: MapOption;
	ball: BallOption;
	rotatingPlayer: boolean;
	spin: boolean;
}

interface PositionsMessage {
	status: Status.POSITIONS,
	ball: PlanePosition,
	player: PlanePosition,
	// player rot ?
	enemy: PlanePosition
	// enemy rot ?
}

enum Object { LIGHTNING, METEOR, TORNADO };
type ParticlesType = "explosion" | "collision" | "impulse";

interface ObjectMessage {
	status: Status.OBJECT,
	type: Object,
	id: number,
	position: Position,
	size: number
	/** @todo more (size,... ) ??*/
}

interface EventMessage {
	status: Status.EVENT,
	type: ParticlesType,
	position: Position
	/** @todo more ??*/
}

type DataMessage = StartMessage | StopMessage | TimingMessage | GoalMessage | OptionMessage | PositionsMessage | ObjectMessage | EventMessage ;

interface PlayerControls {
	mov_right: boolean;
	mov_left: boolean;
	rot_right: boolean;
	rot_left: boolean;
	apply_effect: boolean;
}

export { Position, PlanePosition, DataMessage, PlayerControls, ParticlesType, Status, Object };
export { StartMessage, StopMessage, TimingMessage, GoalMessage, OptionMessage, PositionsMessage, ObjectMessage, EventMessage };
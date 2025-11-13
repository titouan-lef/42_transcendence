import { Lightning } from "../game/map/map_utils/Lightning.js";
import { Meteor } from "../game/map/map_utils/Meteor.js";
import { Tornado } from "../game/map/map_utils/Tornado.js";
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
	SCORE,			// score
	OPTIONS,		// precise game options
	POSITIONS,		// positions of ball and players
	OBJECT,			// tornados / meteors / thunders
	EVENT			// particules launcher
}

/**
 * ------------  DATA FLOW  ------------
 * 
 * new game -> START, OPTIONS, POSITIONS, SCORE, TIMING
 * 
 * TIMING (countdown)	<-------------------
 * during rounds:	<-------------------	|
 * 		POSITIONS 						|	|
 * 		OBJECT if any					|	|
 * 		EVENT if any	----------------	|
 * 											|
 * on goal:									|
 * 		EVENT (goal -> explosion, pause)	|
 * 		SCORE								|
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
	status: Status.STOP,
	playerName: string,
	enemyName: string
}

interface TimingMessage {
	status: Status.TIMING,
	time : number
}

interface ScoreMessage {
	status: Status.SCORE,
	player: number,
	enemy: number
}

interface OptionMessage {
	status: Status.OPTIONS,
	map: MapOption;
	ball: BallOption;
	rotatingPlayer: boolean;
	spin: boolean;
}

interface PositionsMessage {
	status: Status.POSITIONS,
	ball: PlanePosition,
	player: PlanePosition,
	enemy: PlanePosition
}

type Object = Lightning | Meteor | Tornado;
type ParticlesType = "explosion" | "collision" | "impulse";

interface ObjectMessage {
	status: Status.OBJECT,
	type: Object,
	position: PlanePosition
	/** @todo more (size,... ) ??*/
}

interface EventMessage {
	status: Status.EVENT,
	type: ParticlesType,
	position: PlanePosition
	/** @todo more ??*/
}

type ReicivedMessage = StartMessage | StopMessage | TimingMessage | ScoreMessage | OptionMessage | PositionsMessage | ObjectMessage | EventMessage ;

interface PlayerControls {
	mov_right: boolean;
	mov_left: boolean;
	rot_right: boolean;
	rot_left: boolean;
	apply_effect: boolean;
}

export { Position, ReicivedMessage, PlayerControls, ParticlesType, Status };
export { StartMessage, StopMessage, TimingMessage, ScoreMessage, OptionMessage, PositionsMessage, ObjectMessage, EventMessage };
import * as babylon from "@babylonjs/core";

const WHITE: babylon.Color3					= new babylon.Color3(1,1,1);
const BLACK: babylon.Color3					= new babylon.Color3(0,0,0);
const RED: babylon.Color3					= new babylon.Color3(1,0,0);
const GREEN: babylon.Color3					= new babylon.Color3(0,1, 0);
const BLUE: babylon.Color3					= new babylon.Color3(0, 0, 1);
const YELLOW: babylon.Color3				= new babylon.Color3(1, 1, 0);
const CYAN: babylon.Color3					= new babylon.Color3(0, 1, 1);
const MAGENTA: babylon.Color3				= new babylon.Color3(1, 0, 1);
const GREY: babylon.Color3					= new babylon.Color3(0.5, 0.5, 0.5);
const DARK_GREY: babylon.Color3				= new babylon.Color3(0.25, 0.25, 0.25);
const LIGHT_GREY: babylon.Color3			= new babylon.Color3(0.75, 0.75, 0.75);
const ORANGE: babylon.Color3				= new babylon.Color3(1, 0.5, 0);
const PURPLE: babylon.Color3				= new babylon.Color3(0.5, 0, 0.5);
const PINK: babylon.Color3					= new babylon.Color3(1, 0.75, 0.8);
const BROWN: babylon.Color3					= new babylon.Color3(0.6, 0.3, 0.1);
const LIME: babylon.Color3					= new babylon.Color3(0.75, 1, 0);
const NAVY: babylon.Color3					= new babylon.Color3(0, 0, 0.5);
const TEAL: babylon.Color3					= new babylon.Color3(0, 0.5, 0.5);
const OLIVE: babylon.Color3					= new babylon.Color3(0.5, 0.5, 0);
const SUNCOLOR_DEFAULT: babylon.Color3		= new babylon.Color3(1, 0.9, 0.5);
const LIGHTCOLOR_DEFAULT: babylon.Color3	= new babylon.Color3(1, 0.9, 0.5);
/**
* WHITE, BLACK, RED, GREEN, BLUE, YELLOW, CYAN, MAGENTA, GREY,
	DARK_GREY, LIGHT_GREY, ORANGE, PURPLE, PINK, BROWN, LIME, NAVY, TEAL, OLIVE,
	SUNCOLOR_DEFAULT, LIGHTCOLOR_DEFAULT
*/
export const COLORS: Record<string, babylon.Color3> = {
	white: WHITE,
	black: BLACK,
	red: RED,
	green: GREEN,
	blue: BLUE,
	yellow: YELLOW,
	cyan: CYAN,
	magenta: MAGENTA,
	grey: GREY,
	darkGrey: DARK_GREY,
	lightGrey: LIGHT_GREY,
	orange: ORANGE,
	purple: PURPLE,
	pink: PINK,
	brown: BROWN,
	lime: LIME,
	navy: NAVY,
	teal: TEAL,
	olive: OLIVE,
	sunColorDefault: SUNCOLOR_DEFAULT,
	lightColorDefault: LIGHTCOLOR_DEFAULT
};

export const POINTS_TO_WIN = 5;

export const MAP_SIZE: babylon.Vector3 = new babylon.Vector3(100, 50, 100);
export const CAMERA_POS_X = MAP_SIZE.x * 1.4;
export const WALL_WIDTH = 3;
export const WALL_HEIGHT = 5;
export const SCORE_CANVAS_SIZE_X = 512;
export const SCORE_CANVAS_SIZE_Y = 256;
export const SCORE_SIZE = 120;
export const SCORE_POS_Y = 20;
export const SUN_DIAMETER = 20;
export const GLOW_INTENSITY = 0.6;
export const PARTICLE_NUMBER = 500;

export const PLAYER_DIMENSION: babylon.Vector3 =  new babylon.Vector3(3, 3, 12); // z > 2 * x
export const PLAYER_MASS = 1;
export const PLAYER_RESTITUTION = 1;
export const PLAYER_MOVEMENT_IMPULSE = MAP_SIZE.z * PLAYER_MASS * 0.8;
export const PLAYER_ROTATION_IMPULSE = MAP_SIZE.x * PLAYER_MASS * 0.4;

/** BALL SETTINGS */
export const BALL_DIAMETER = 2; //has to be smaller than the player
export const MAX_SPEED = 60;
export const TRAIL_CREATION_INTERVAL = 15;
export const NERF_SPEED_FACTOR = MAX_SPEED / 4;
export const INVISIBLE_BALL_FADING_INTERVAL = 50;
export const INVISIBLE_BALL_INVISIBILITY_INTERVAL = 1200;
export const TRICKY_BALL_EFFECT_INTERVAL = 2500;
export const TRICKY_BALL_EFFECT_FORCE = 50;
export const PULSE_BALL_EFFECT_INTERVAL = 1000;
export const SNAKE_BALL_ANGULAR_FORCE = 4;
/** Angular interval is the number of step it will take to reach max/min value */
export const SNAKE_BALL_ANGULAR_INTERVAL = 20;
export const BALL_ANGULAR_FORCE = 0.5;
/** Angular interval is the number of step it will take to reach max/min value */
export const BALL_ANGULAR_INTERVAL = 45;

/** @todo SUN placement + refacto map classes */
/** @todo player sometimes blocked when pressing right left, should be solved with server side */
/** @todo maps */
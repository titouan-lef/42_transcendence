import * as babylon from "/babylonjs/core/index.js";

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

export const MAP_SIZE: babylon.Vector3 = new babylon.Vector3(75, 75, 75);
export const WALL_WIDTH = 3;
export const WALL_HEIGHT = 5;
export const BALL_DIAMETER = 2;
export const PLAYER_DIMENSION: babylon.Vector3 =  new babylon.Vector3(3, 3, 10);
export const PARTICLE_NUMBER = 500;
export const GLOW_INTENSITY = 0.6;
export const SUN_DIAMETER = 20;
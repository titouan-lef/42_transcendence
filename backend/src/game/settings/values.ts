import * as babylon from "@babylonjs/core";

export const COLORS3 = {
	// REGULAR COLORS
	white:							babylon.Color3.FromHexString("#FFFFFF"),
	red:							babylon.Color3.FromHexString("#FF0000"),
	green:							babylon.Color3.FromHexString("#00FF00"),
	blue:							babylon.Color3.FromHexString("#0000FF"),
	yellow:							babylon.Color3.FromHexString("#FFFF00"),
	orange:							babylon.Color3.FromHexString("#FF8000"),
	magenta:						babylon.Color3.FromHexString("#FF00FF"),
	black:							babylon.Color3.FromHexString("#000000"),
	grey:							babylon.Color3.FromHexString("#808080")
};

/**DEBUG FUNCTION */
export const SHOW_DISPOSE_LOGS = false;

/**GAMEPLAY GENERAL SETTINGS */
export const POINTS_TO_WIN = 11;
export const START_TIMEOUT = 4; // in seconds
const FPS_MULTIPLICATOR = 2;
const PSPS_MULTIPLICATOR = 4;
const FRAME_PER_SECOND = 60 * FPS_MULTIPLICATOR;
const PHYSIC_STEP_PER_SEC = 60 * PSPS_MULTIPLICATOR;
export const GAME_STEP_INTERVAL = 1000 / FRAME_PER_SECOND;
export const PHYSIC_STEP_INTERVAL = 1000 / PHYSIC_STEP_PER_SEC;

/**MAP GENERAL SETTINGS */
export const MAP_SIZE: babylon.Vector3 = new babylon.Vector3(100, 100, 100); //BACK + FRONT
export const WALL_WIDTH = 3; //BACK + FRONT
export const WALL_HEIGHT = 5; //BACK + FRONT
export const WIND_FORCE = 10 / PSPS_MULTIPLICATOR; //BACK + FRONT


/**OBJECTS */
export const LIGHTNING_INTERVAL = 60 * FPS_MULTIPLICATOR;
export const LIGHTNING_LIFETIME = 80 * FPS_MULTIPLICATOR;
export const LIGHTNING_FRAMES_TO_DISAPPEAR = 30 * FPS_MULTIPLICATOR;
export const LIGHTNING_COLLISION_RADIUS = 5; //BACK + FRONT
export const LIGHTNING_COLLISION_STRENGTH = 30 / PSPS_MULTIPLICATOR;

export const METEOR_INTERVAL = 300 * FPS_MULTIPLICATOR;
export const METEOR_DIAMETER = 2; //BACK + FRONT
export const METEOR_LIFETIME = 240 * FPS_MULTIPLICATOR;
export const METEOR_COLLISION_RADIUS = METEOR_DIAMETER; //BACK + FRONT
export const METEOR_COLLISION_STRENGTH = 30 / PSPS_MULTIPLICATOR;
export const METEOR_SPEED = 1 / FPS_MULTIPLICATOR;

export const TORNADO_INTERVAL = 240 * FPS_MULTIPLICATOR;
export const TORNADO_LIFETIME = 240 * FPS_MULTIPLICATOR;
export const TORNADO_ATTRACTION_STRENGTH = 125 / PSPS_MULTIPLICATOR;
export const TORNADO_COLLISION_RADIUS = 3; //BACK + FRONT

export const CANON_DIMENSION = new babylon.Vector3(3, 3, 7); //BACK + FRONT
export const CANON_BALL_INTERVAL = 180 * FPS_MULTIPLICATOR;
export const CANON_LINEAR_VELOCITY_X = 10;
export const CANON_ANGULAR_VELOCITY_Y = 1;
export const CANON_MAX_COUNT = 2;
export const CANON_CHANGE_STUN_INTERVAL = 420 * FPS_MULTIPLICATOR;

/**PLAYER */
export const PLAYER_DIMENSION: babylon.Vector3 =  new babylon.Vector3(3, 3, 12); // z > 2 * x //BACK + FRONT
export const PLAYER_MASS = 1;
export const PLAYER_RESTITUTION = 1;
export const PLAYER_MOVEMENT_VELOCITY = 65;
export const PLAYER_ROTATION_VELOCITY = 12;
export const PLAYER_DASH_CD = 20 * FPS_MULTIPLICATOR;
export const PLAYER_DASH_MULT = 100;
export const PLAYER_DASH_DURATION = 5 * FPS_MULTIPLICATOR;
export const PLAYER_STUN_DURATION = 150 * FPS_MULTIPLICATOR;

/** BALL SETTINGS */
export const BALL_DIAMETER = 2; //has to be smaller than the player //BACK + FRONT
export const MAX_SPEED = 40;
export const MIN_SPEED = 15;
export const BUFF_SPEED_INTERVAL = 30 * FPS_MULTIPLICATOR;
export const INCREASE_GENERAL_SPEED_FACTOR = 1 / 100;
export const NERF_SPEED_FACTOR = MAX_SPEED / 4;
export const BALL_ANGULAR_FORCE = 0.6 / FPS_MULTIPLICATOR;
export const BALL_ANGULAR_INTERVAL = 45 * FPS_MULTIPLICATOR; /** Angular interval is the number of step it will take to reach max/min value */
export const UNSTUCK_TIMER = 420 * FPS_MULTIPLICATOR;

export const INVISIBLE_BALL_FADING_INTERVAL = 15 * FPS_MULTIPLICATOR;
export const INVISIBLE_BALL_LOOSING_VISIBILITY_INTERVAL = 25 * FPS_MULTIPLICATOR;
export const INVISIBLE_BALL_INVISIBILITY_INTERVAL = 15 * FPS_MULTIPLICATOR;

export const TRICKY_BALL_EFFECT_INTERVAL = 150 * FPS_MULTIPLICATOR;
export const TRICKY_BALL_FORWARD_ONLY = true;

export const PULSE_BALL_EFFECT_INTERVAL = 100 * FPS_MULTIPLICATOR;

export const SNAKE_BALL_ANGULAR_FORCE = 4 / FPS_MULTIPLICATOR;
export const SNAKE_BALL_ANGULAR_INTERVAL = 20 * FPS_MULTIPLICATOR; /** Angular interval is the number of step it will take to reach max/min value */

import * as babylon from "@babylonjs/core";

/**DEBUG FUNCTION */
/**@todo should be false */
export const SHOW_DISPOSE_LOGS = false;

/**GAMEPLAY GENERAL SETTINGS */
export const POINTS_TO_WIN = 11;
export const START_TIMEOUT = 4; // in seconds

/**MAP GENERAL SETTINGS */
export const MAP_SIZE: babylon.Vector3 = new babylon.Vector3(100, 100, 100); //BACK + FRONT
export const WALL_WIDTH = 3; //BACK + FRONT
export const WALL_HEIGHT = 5; //BACK + FRONT

/**SKY MAP */
export const LIGHTNING_INTERVAL = 600;
export const LIGHTNING_LIFETIME = 800;
export const LIGHTNING_FRAMES_TO_DISAPPEAR = 30;
export const LIGHTNING_COLLISION_RADIUS = 5; //BACK + FRONT
export const LIGHTNING_COLLISION_STRENGTH = 30;

/**VOLCANO MAP */
export const METEOR_INTERVAL = 3000;
export const METEOR_DIAMETER = 2; //BACK + FRONT
export const METEOR_LIFETIME = 5000;
export const METEOR_COLLISION_RADIUS = METEOR_DIAMETER; //BACK + FRONT
export const METEOR_COLLISION_STRENGTH = 30;
export const METEOR_SPEED = 100;

/**DESERT MAP */
export const TORNADO_INTERVAL = 3000;
export const TORNADO_LIFETIME = 8000;
export const WIND_FORCE = 10; //BACK + FRONT
export const TORNADO_ATTRACTION_STRENGTH = 100;
export const TORNADO_COLLISION_RADIUS = 3; //BACK + FRONT

/**PLAYER */
export const PLAYER_DIMENSION: babylon.Vector3 =  new babylon.Vector3(3, 3, 12); // z > 2 * x //BACK + FRONT
export const PLAYER_MASS = 1;
export const PLAYER_RESTITUTION = 1;
export const PLAYER_MOVEMENT_VELOCITY = 65;
export const PLAYER_ROTATION_VELOCITY = 10;

/** BALL SETTINGS */
export const BALL_DIAMETER = 2; //has to be smaller than the player //BACK + FRONT
export const MAX_SPEED = 60;
export const NERF_SPEED_FACTOR = MAX_SPEED / 4;
export const BALL_ANGULAR_FORCE = 0.5;
export const BALL_ANGULAR_INTERVAL = 45; /** Angular interval is the number of step it will take to reach max/min value */

export const INVISIBLE_BALL_FADING_INTERVAL = 50;
export const INVISIBLE_BALL_LOOSING_VISIBILITY_INTERVAL = 100;
export const INVISIBLE_BALL_INVISIBILITY_INTERVAL = 75;

export const TRICKY_BALL_EFFECT_INTERVAL = 150;
export const TRICKY_BALL_FORWARD_ONLY = true;

export const PULSE_BALL_EFFECT_INTERVAL = 100;

export const SNAKE_BALL_ANGULAR_FORCE = 4;
export const SNAKE_BALL_ANGULAR_INTERVAL = 20; /** Angular interval is the number of step it will take to reach max/min value */
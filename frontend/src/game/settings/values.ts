import * as babylon from "@babylonjs/core";

/**
* WHITE, BLACK, RED, GREEN, BLUE, YELLOW, CYAN, MAGENTA, GREY,
	DARK_GREY, LIGHT_GREY, ORANGE, PURPLE, PINK, BROWN, LIME, NAVY, TEAL, OLIVE,
	SUNCOLOR_DEFAULT, LIGHTCOLOR_DEFAULT
*/
export const COLORS3: Record<string, babylon.Color3> = {
	white: new babylon.Color3(1, 1, 1),
	black: new babylon.Color3(0, 0, 0),
	red: new babylon.Color3(1, 0, 0),
	green: new babylon.Color3(0, 1, 0),
	blue: new babylon.Color3(0, 0, 1),
	yellow: new babylon.Color3(1, 1, 0),
	cyan: new babylon.Color3(0, 1, 1),
	magenta: new babylon.Color3(1, 0, 1),
	grey: new babylon.Color3(0.5, 0.5, 0.5),
	darkGrey: new babylon.Color3(0.25, 0.25, 0.25),
	lightGrey: new babylon.Color3(0.75, 0.75, 0.75),
	orange: new babylon.Color3(1, 0.5, 0),
	purple: new babylon.Color3(0.5, 0, 0.5),
	pink: new babylon.Color3(1, 0.75, 0.8),
	brown: new babylon.Color3(0.6, 0.3, 0.1),
	lime: new babylon.Color3(0.75, 1, 0),
	navy: new babylon.Color3(0, 0, 0.5),
	teal: new babylon.Color3(0, 0.5, 0.5),
	olive: new babylon.Color3(0.5, 0.5, 0),
	sunColorDefault: new babylon.Color3(1, 0.9, 0.5),
	lightColorDefault: new babylon.Color3(1, 0.9, 0.5),
	lightColorRainy: new babylon.Color3(0.6, 0.65, 0.8),
	groundColorRainy: new babylon.Color3(0.05, 0.25, 0.4),

	volcanoEmissiveSun:       new babylon.Color3(1, 0.478, 0.165),
	volcanoDiffuseLight:      new babylon.Color3(1, 0.58, 0.26),
	volcanoSpecularLight:     new babylon.Color3(1, 0.690, 0.404),
	volcanoDiffuseGround:     new babylon.Color3(0.227, 0.102, 0.086),
	volcanoEmissiveGround:    new babylon.Color3(0.35, 0.15, 0.11),
	volcanoDiffuseMeteor:     new babylon.Color3(0.353, 0.165, 0.102),
	volcanoSpecularMeteor:    new babylon.Color3(0.659, 0.353, 0.204),
	volcanoEmissiveMeteor:    new babylon.Color3(1, 0.38, 0.16),
	volcanoDiffuseMeteorLight:new babylon.Color3(1, 0.416, 0.165),
	volcanoDiffuseWall:       new babylon.Color3(0.82, 0.60, 0.18),
};

export const COLORS4: Record<string, babylon.Color4> = {
	volcanoDiffuseAsh1:       new babylon.Color4(1, 0.471, 0.157, 1),
	volcanoDiffuseAsh2:       new babylon.Color4(1, 0.471, 0.157, 0.55),
	volcanoDiffuseAshDead:    new babylon.Color4(1, 0.471, 0.157, 0),
	volcanoDiffuseSky:        new babylon.Color4(0.34, 0.30, 0.28, 1),
	volcanoDiffuseTrail1:     new babylon.Color4(1, 0.47, 0.14, 1),
	volcanoDiffuseTrail2:     new babylon.Color4(0.706, 0.157, 0, 0.6),
	volcanoDiffuseTrailDead:  new babylon.Color4(1, 0.314, 0.078, 0.2),
	volcanoDiffuseDust1:      new babylon.Color4(0.300, 0.120, 0.080, 0.9),
	volcanoDiffuseDust2:      new babylon.Color4(0.250, 0.100, 0.070, 0.9),
	volcanoDiffuseDustDead:   new babylon.Color4(0.200, 0.080, 0.050, 0.7)
};


export const POINTS_TO_WIN = 5;

export const MAP_SIZE: babylon.Vector3 = new babylon.Vector3(100, 100, 100);
export const CAMERA_POS_X = MAP_SIZE.x * 1.4;
export const WALL_WIDTH = 3;
export const WALL_HEIGHT = 5;
export const SCORE_CANVAS_SIZE = new babylon.Vector2(512, 256);
export const SCORE_SIZE = 120;
export const SCORE_POS_Y = 20;
export const COUNTDOWN_POS_Y = 30;
export const COUNTDOWN_CANVAS_SIZE = new babylon.Vector2(512, 256);
export const COUNTDOWN_SIZE = 200;
export const SUN_DIAMETER = 20;
export const GLOW_INTENSITY = 0.6;
export const START_TIMEOUT = 4000;

/**DEFAULT MAP */
export const D_PARTICLE_NUMBER = 500;

/**RAINY MAP */
export const R_PARTICLE_NUMBER = 4000;
export const LIGHTNING_INTERVAL = 600;
export const LIGHTNING_FADING_INTERVAL = 40;
export const LIGHTNING_COLLISION_RADIUS = 5;
export const LIGHTNING_COLLISION_STRENGTH = 30;
export const LIGHTNING_LIFETIME = 2000;

/**VOLCANO MAP */
export const V_PARTICLE_NUMBER = 4000;
export const METEOR_INTERVAL = 3000;
export const METEOR_DIAMETER = 2;
export const METEOR_PARTICLE_INTERVAL = 5000;
export const METEOR_LIFETIME = 5000;
export const METEOR_COLLISION_RADIUS = METEOR_DIAMETER;
export const METEOR_COLLISION_STRENGTH = 30;
export const METEOR_SPEED = 100;

/**WINDY MAP */
export const W_PARTICLE_NUMBER = 3000;
export const TORNADO_INTERVAL = 3000;
export const TORNADO_LIFETIME = 8000;
export const WIND_FORCE = 5;
export const TORNADO_ATTRACTION_STRENGTH = 100;
export const TORNADO_COLLISION_RADIUS = 3;
export const TORNADO_HEIGHT = 40;


/**PLAYER */
export const PLAYER_DIMENSION: babylon.Vector3 =  new babylon.Vector3(3, 3, 12); // z > 2 * x
export const PLAYER_MASS = 1;
export const PLAYER_RESTITUTION = 1;
export const PLAYER_MOVEMENT_VELOCITY = 65;
export const PLAYER_ROTATION_VELOCITY = 10;
export const PLAYER_TRAIL_INTERVAL = 25;
export const PLAYER_TRAIL_ON = true;

/** BALL SETTINGS */
export const BALL_DIAMETER = 2; //has to be smaller than the player
export const MAX_SPEED = 60;
export const BALL_TRAIL_INTERVAL = 15;
export const BALL_TRAIL_ON = true;
export const NERF_SPEED_FACTOR = MAX_SPEED / 4;
export const INVISIBLE_BALL_FADING_INTERVAL = 50;
export const INVISIBLE_BALL_INVISIBILITY_INTERVAL = 1200;
export const TRICKY_BALL_EFFECT_INTERVAL = 2500;
export const TRICKY_BALL_FORWARD_ONLY = true;
export const PULSE_BALL_EFFECT_INTERVAL = 1000;
export const SNAKE_BALL_ANGULAR_FORCE = 4;
/** Angular interval is the number of step it will take to reach max/min value */
export const SNAKE_BALL_ANGULAR_INTERVAL = 20;
export const BALL_ANGULAR_FORCE = 0.5;
/** Angular interval is the number of step it will take to reach max/min value */
export const BALL_ANGULAR_INTERVAL = 45;

/** @todo do something highlights */
/** @todo windymap design*/
/** @todo block camera */
/** @todo player sometimes blocked when pressing right left, should be solved with server side */
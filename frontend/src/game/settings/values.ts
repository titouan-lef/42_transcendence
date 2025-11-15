import * as babylon from "@babylonjs/core";

export const COLORS3 = {
	// REGULAR COLORS
	white:							babylon.Color3.FromHexString("#FFFFFF"),
	black:							babylon.Color3.FromHexString("#000000"),
	red:							babylon.Color3.FromHexString("#FF0000"),
	green:							babylon.Color3.FromHexString("#00FF00"),
	blue:							babylon.Color3.FromHexString("#0000FF"),
	yellow:							babylon.Color3.FromHexString("#FFFF00"),
	cyan:							babylon.Color3.FromHexString("#00FFFF"),
	magenta:						babylon.Color3.FromHexString("#FF00FF"),
	grey:							babylon.Color3.FromHexString("#808080"),
	darkGrey:						babylon.Color3.FromHexString("#404040"),
	lightGrey:						babylon.Color3.FromHexString("#C0C0C0"),
	orange:							babylon.Color3.FromHexString("#FF8000"),
	purple:							babylon.Color3.FromHexString("#800080"),
	pink:							babylon.Color3.FromHexString("#FFBFCB"),
	brown:							babylon.Color3.FromHexString("#99661A"),
	lime:							babylon.Color3.FromHexString("#BFFF00"),
	navy:							babylon.Color3.FromHexString("#000080"),
	teal:							babylon.Color3.FromHexString("#008080"),
	olive:							babylon.Color3.FromHexString("#808000"),

	// PLAYER
	playerEmissiveNormalFace:		babylon.Color3.FromHexString("#ffffff"),
	playerEmissiveSpinEffectFace:	babylon.Color3.FromHexString("#ff0000"),

	// VOLCANO
	volcanoEmissiveSun:				babylon.Color3.FromHexString("#FF7A2A"),
	volcanoDiffuseLight:			babylon.Color3.FromHexString("#FF9442"),
	volcanoDiffuseGround:			babylon.Color3.FromHexString("#3A1A16"),
	volcanoEmissiveGround:			babylon.Color3.FromHexString("#59261C"),
	volcanoDiffuseMeteor:			babylon.Color3.FromHexString("#5A2A1A"),
	volcanoEmissiveMeteor:			babylon.Color3.FromHexString("#FF6128"),
	volcanoDiffuseMeteorLight:		babylon.Color3.FromHexString("#FF6A2A"),
	volcanoDiffuseWall:				babylon.Color3.FromHexString("#D19A2E"),
	volcanoHighlightWall:			babylon.Color3.FromHexString("#ff5e00"),

	// SKY
	skyEmissiveSun:					babylon.Color3.FromHexString("#FFA50F"),
	skyDiffuseLight:				babylon.Color3.FromHexString("#f0ece5"),
	skyDiffuseGround:				babylon.Color3.FromHexString("#8da087"),
	skyEmissiveGround:				babylon.Color3.FromHexString("#757c6d"),
	skyDiffuseWall:					babylon.Color3.FromHexString("#ffffff"),
	skyEmissiveWall:				babylon.Color3.FromHexString("#92b3eb"),
	skyEmissiveLightning:			babylon.Color3.FromHexString("#bceefc"),
	skySparksC1:					babylon.Color3.FromHexString("#FFFFFF"),
	skySparksC2:					babylon.Color3.FromHexString("#3898B0"),
	skySparksC3:					babylon.Color3.FromHexString("#11C5F0"),

	// DESERT
	desertDiffuseGround:			babylon.Color3.FromHexString("#e98502"),
	desertEmissiveGround:			babylon.Color3.FromHexString("#d87a00"),
	desertEmissiveSun:				babylon.Color3.FromHexString("#f89430"),
	desertDiffuseLight:				babylon.Color3.FromHexString("#f8f5f2"),
	desertDiffuseWall:				babylon.Color3.FromHexString("#ac5c00"),
	desertHighlightWall:			babylon.Color3.FromHexString("#ffbb00"),

	//DEFAULT
	defaultDiffuseGround:			babylon.Color3.FromHexString("#000000"),
	defaultEmissiveBars:			babylon.Color3.FromHexString("#FFFFFF"),
	defaultHighlightWall:			babylon.Color3.FromHexString("#FF0000"),
	defaultEmissiveSun:				babylon.Color3.FromHexString("#FFE699"),
	defaultDiffuseLight:			babylon.Color3.FromHexString("#FFE699"),
	defaultDiffuseWall:				babylon.Color3.FromHexString("#ffffff"),
};

function convertToColor4(hex: string, a: number): babylon.Color4 {
	const c = babylon.Color3.FromHexString(hex);
	return new babylon.Color4(c.r, c.g, c.b, a);
};

export const COLORS4 = {
	volcanoDiffuseAsh1:			convertToColor4("#FF7828", 1),
	volcanoDiffuseAsh2:			convertToColor4("#FF7828", 0.55),
	volcanoDiffuseAshDead:		convertToColor4("#FF7828", 0),
	volcanoDiffuseSky:			convertToColor4("#574D47", 1),
	volcanoDiffuseTrail1:		convertToColor4("#FF7716", 1),
	volcanoDiffuseTrail2:		convertToColor4("#B32700", 0.6),
	volcanoDiffuseTrailDead:	convertToColor4("#FF5020", 0.2),
	volcanoDiffuseDust1:		convertToColor4("#4C1F14", 0.9),
	volcanoDiffuseDust2:		convertToColor4("#401A12", 0.9),
	volcanoDiffuseDustDead:		convertToColor4("#33140D", 0.7),

	skyDiffuseSky:				convertToColor4("#A1AA96", 1),
	skyRain1:					convertToColor4("#D9E6FF", 0.85),
	skyRain2:					convertToColor4("#D9E6FF", 0.60),
	skyRainDead:				convertToColor4("#D9E6FF", 0.00),
	skyLightningSpark1:			convertToColor4("#FFFFFF", 1.00),
	skyLightningSpark2:			convertToColor4("#99CCFF", 0.85),
	skyLightningSpark3:			convertToColor4("#3380FF", 0.00),

	desertWind1:				convertToColor4("#5c3502", 0.85),
	desertWind2:				convertToColor4("#5c3502", 0.65),
	desertWindDead:				convertToColor4("#5c3502", 0.00),
	desertTornado1:				convertToColor4("#5c3502", 0.40),
	desertTornado2:				convertToColor4("#5c3502", 0.20),
	desertTornadoDead:			convertToColor4("#5c3502", 0.00),
	desertSky:					convertToColor4("#af8145", 1),

	defaultStar1:				convertToColor4("#ffffff", 1),
	defaultStar2:				convertToColor4("#ffffff", 0.7),
	defaultStarDead:			convertToColor4("#ffffff", 0),
	defaultSky:					convertToColor4("#000000", 1)
};

/**DEBUG FUNCTION */
/**@todo should be false */
export const MOVE_BALL_ONCLICK = false;
export const MOVE_CAMERA_ONCLICK = false;
export const SHOW_DISPOSE_LOGS = false;

/**GAMEPLAY GENERAL SETTINGS */
export const POINTS_TO_WIN = 11;
export const START_TIMEOUT = 4; // in seconds

/**MAP GENERAL SETTINGS */
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

/**DEFAULT MAP */
export const D_PARTICLE_NUMBER = 500;
export const D_GLOW_INTENSITY = 0.6;

/**SKY MAP */
export const R_PARTICLE_NUMBER = 4000;
export const LIGHTNING_INTERVAL = 600;
export const LIGHTNING_LIFETIME = 1200;
export const LIGHTNING_FRAMES_TO_DISAPPEAR = 30;
export const LIGHTNING_COLLISION_RADIUS = 5;
export const LIGHTNING_COLLISION_STRENGTH = 30;
export const R_GLOW_INTENSITY = 0.3;

/**VOLCANO MAP */
export const V_PARTICLE_NUMBER = 4000;
export const METEOR_INTERVAL = 3000;
export const METEOR_DIAMETER = 2;
export const METEOR_PARTICLE_INTERVAL = 5000;
export const METEOR_LIFETIME = 5000;
export const METEOR_COLLISION_RADIUS = METEOR_DIAMETER;
export const METEOR_COLLISION_STRENGTH = 30;
export const METEOR_SPEED = 100;
export const V_GLOW_INTENSITY = 0.7;

/**DESERT MAP */
export const W_PARTICLE_NUMBER = 3000;
export const TORNADO_INTERVAL = 3000;
export const TORNADO_LIFETIME = 8000;
export const WIND_FORCE = 10;
export const TORNADO_ATTRACTION_STRENGTH = 100;
export const TORNADO_COLLISION_RADIUS = 3;
export const TORNADO_HEIGHT = 40;
export const W_GLOW_INTENSITY = 0.3;


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

/** @todo player sometimes blocked when pressing right left, should be solved with server side */
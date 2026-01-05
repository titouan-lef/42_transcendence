interface Plage {
	min: number;
	max: number;
};

/**
 * Define a plage where parameters are the min and the max.
 */
function getPlage(plageA: number, plageB: number): Plage {
	return (plageA < plageB ? { min: plageA, max: plageB } : { min: plageB, max: plageA });
};

/**
 * Linear interpolation.
 * @param x First value (1 - t weight).
 * @param y Second value (t weight).
 * @param t Ration on [0, 1]. 
 * @returns Value after the linear interpolation.
 */
function lerp(x: number, y: number, t: number): number {
	return x + t * (y - x); // Must be also write (1 - t) * x + t * y.
}

function clamp(value: number, min: number, max: number): number {
	return Math.min(Math.max(value, min), max);
}

function round(value: number, nbDecimal: number): number {
	const coeff = Math.pow(10, nbDecimal);
	return Math.round(value * coeff) / coeff;
}

function randomInt(min: number, max: number): number {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

export { getPlage, lerp, clamp, round, randomInt };

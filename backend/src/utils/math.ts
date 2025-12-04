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

export { clamp, round, randomInt };

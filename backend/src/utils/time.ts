const TIME_DAY = 24 * 60 * 60 * 1000;// hours * minutes * seconds * milliseconds

function wait(ms: number): Promise<void> {
	return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Get number of days between two dates (result is rounded to the nearest).
 */
function nbDayBetween(dateA: Date, dateB: Date): number {
	const diff = dateA.getTime() - dateB.getTime();
	const diffDay = Math.abs(diff / TIME_DAY);
	return Math.floor(diffDay);
}

export { wait, nbDayBetween };

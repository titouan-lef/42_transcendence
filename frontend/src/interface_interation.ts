function getInput(id: string): HTMLInputElement | null {
	const el: HTMLElement | null = document.getElementById(id);
	if (el instanceof HTMLInputElement)
		return el;
	return null;
}

function isOneStringEmtpy(...args: string[]): boolean {
	for (const arg of args) {
		if (!arg)
			return true;
	}
	return false;
}

export { getInput, isOneStringEmtpy };
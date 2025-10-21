function getInput(id: string): HTMLInputElement | null {
	const el: HTMLElement | null = document.getElementById(id);
	if (el instanceof HTMLInputElement)
		return el;
	return null;
}

export { getInput };
function getSafeElement(id: string): HTMLElement {
	const elem = document.getElementById(id);
	if (!elem)
		throw new Error("cannot find id " + id);
	return (elem);
}

export { getSafeElement };

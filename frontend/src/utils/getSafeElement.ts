function getSafeElement(id: string): HTMLElement {
	const elem = document.getElementById(id);
	if (!elem)
		throw new Error("cannot find id " + id);
	return (elem);
}

function getSafeInput(id: string): HTMLInputElement {
	const elem = document.getElementById(id);
	if (!elem)
		throw new Error("cannot find id " + id);
	if (elem instanceof HTMLInputElement)
		return (elem);
	throw new Error(id + "is not an input");
}

export { getSafeElement, getSafeInput };

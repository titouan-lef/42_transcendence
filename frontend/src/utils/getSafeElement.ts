interface TagType<T> { new (): T };

function getSafeElement<T extends HTMLElement>(id: string, tagType: TagType<T>): T {
	const elem = document.getElementById(id);
	if (!elem)
		throw new Error("cannot find id " + id);
	if (elem instanceof tagType)
		return (elem);
	throw new Error("element get with id " + id + " does not correspond with tag type passed in parameter");
}

export { TagType, getSafeElement };

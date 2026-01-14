interface TagType<T> { new (): T };

function getSafeElement<T extends HTMLElement>(id: string, tagType: TagType<T>): T | undefined {
	const elem = document.getElementById(id);
	if (elem && elem instanceof tagType)
		return (elem);
	return undefined;
}

export { TagType, getSafeElement };

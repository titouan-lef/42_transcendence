type ListenerUpdate = () => void;

const LANG_LISTENERS = new Set<ListenerUpdate>();

function onLangChange(listenerUpdate: ListenerUpdate): void {
	LANG_LISTENERS.add(listenerUpdate);
}

function updateTranslation(): void {
	LANG_LISTENERS.forEach(listenerUpdate => listenerUpdate());
}

function clearLangListeners(): void {
	LANG_LISTENERS.clear();
}

export { onLangChange, updateTranslation, clearLangListeners };
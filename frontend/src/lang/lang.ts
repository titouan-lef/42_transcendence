import { CodeLang, TRANSLATOR } from "./translation.js";
import { updateTranslation } from "./langListener.js";

type TranslationKey = keyof typeof TRANSLATOR;// Get all keys of TRANSLATOR.

let lang: CodeLang = getDefaultLang();

function getDefaultLang(): CodeLang {
	return 'en';
}

function setLang(newLang: CodeLang): void {
	lang = newLang;
	updateTranslation();
}

function translateTab(keyTab: TranslationKey[]): string[] {
	const tabMessage: string[] = [];
	keyTab.forEach((key) => {
		const message = translate(key);
		tabMessage.push(message);
	});
	return tabMessage;
}

function translate(key: TranslationKey): string {
	const message = getTranslation(key);
	return formatMessage(message);
}

/**
 * If the string contains placeholders, replace them with their values.
 * @param message String with potentially placeholders.
 */
function formatMessage(message: string): string {
	const regex = regexAllPlaceholder();
	return message.replace(regex, (ignored, key) => getTranslation(key));
}

/**
 * Regex for all id between {}.
 * An id contains at least one char and each char is defined in [a-zA-Z0-9_].
 */
function regexAllPlaceholder(): RegExp {
	return new RegExp("{(\\w+)}", "g");
}

function getTranslation(key: TranslationKey): string {
	const translation = TRANSLATOR[key]?.[lang];
	if (!translation)
		throw new Error("No translation");
	return translation;
}

export { TranslationKey, translateTab, setLang };

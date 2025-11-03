import { TranslationKey, translate } from "../lang/lang.js";
import { onLangChange } from "../lang/langListener.js";
import { getSafeElement, TagType } from "../utils/getSafeElement.js";

interface HtmlData {
	tag: string;
	key: TranslationKey;
	id: string;
	attributeList: Record<string, string>;
}

type SetContentFunc<T> = (el: T, textTranslate: string) => void;

function createHtmlData(tag: string, key: TranslationKey, id: string, attributeList: Record<string, string>): HtmlData {
	const htmlData: HtmlData = { tag, key, id, attributeList };
	return htmlData;
}

/**
 * Create a HTML element and define an event to translate the content.
 * @param htmlData Data which define a HTML element.
 * @param setContent Function which translate the content of the element.
 * @returns The HTML element object created.
 */
function createTranslatableElement<T extends HTMLElement>(htmlData: HtmlData, setContent: SetContentFunc<T>, tagType: TagType<T>): T {
	const element = createElement(htmlData, setContent, tagType);
	onLangChange(() => {
		const el = getSafeElement<T>(htmlData.id, tagType);// Get element because its ref is destroyed when it is converted to a string.
		setContent(el, translate(htmlData.key));
	});
	return element;
}

function createElement<T extends HTMLElement>(htmlData: HtmlData, setContent: SetContentFunc<T>, tagType: TagType<T>): T {
	const element = document.createElement(htmlData.tag);
	if (!(element instanceof tagType))
		throw new Error("Element is not of the correct type to be created");
	applyAttribute(element, htmlData.id, htmlData.attributeList);
	setContent(element, translate(htmlData.key));
	return element;
}

function applyAttribute(element: HTMLElement, id: string, attributeList: Record<string, string>): void {
	element.id = id;
	for (const [key, value] of Object.entries(attributeList))
		element.setAttribute(key, value);
}

export { createHtmlData, createTranslatableElement };

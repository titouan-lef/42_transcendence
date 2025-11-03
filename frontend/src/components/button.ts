import { TranslationKey } from "../lang/lang.js";
import { createHtmlData, createTranslatableElement } from "./utils.js";

function createButtonHtml(key: TranslationKey, id: string, attributeList: Record<string, string> = {}): string {
	const button = createButton(key, id, attributeList);
	return button.outerHTML;
}

function createButton(key: TranslationKey, id: string, attributeList: Record<string, string> = {}): HTMLButtonElement {
	const htmlData = createHtmlData("button", key, id, attributeList);
	return createTranslatableElement(htmlData, (el, translateText) => el.textContent = translateText, HTMLButtonElement);
}

export { createButtonHtml };

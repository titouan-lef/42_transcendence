import { TranslationKey } from "../lang/lang.js";
import { createHtmlData, createTranslatableElement } from "./utils.js";

type InputType = "button" | "text";

function createInputHtml(key: TranslationKey, type: InputType, id: string, attributeList: Record<string, string> = {}): string {
	const element = createInput(key, type, id, attributeList);
	return element.outerHTML;
}

function createInput(key: TranslationKey, type: InputType, id: string, attributeList: Record<string, string> = {}): HTMLInputElement {
	attributeList.type = type;
	const htmlData = createHtmlData("input", key, id, attributeList);
	return createTranslatableElement(htmlData, (el, translateText) => el.value = translateText, HTMLInputElement);
}

export { createInputHtml };

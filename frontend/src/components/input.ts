import { TranslationKey } from "../lang/lang.js";
import { createHtmlData, createTranslatableElement } from "./component_utils.js";

type InputType = "button" | "text" | "password" | "email";

function createInputHtml(keyTab: TranslationKey[], type: InputType, id: string, attributeList: Record<string, string> = {}): string {
	const element = createInput(keyTab, type, id, attributeList);
	return element.outerHTML;
}

function createInput(keyTab: TranslationKey[], type: InputType, id: string, attributeList: Record<string, string> = {}): HTMLInputElement {
	attributeList.type = type;
	const htmlData = createHtmlData("input", keyTab, id, attributeList);
	if (type === "text" || type === "password" || type === "email")
		return createTranslatableElement(htmlData, (el, translateTextTab) => el.placeholder = translateTextTab[0], HTMLInputElement);
	return createTranslatableElement(htmlData, (el, translateTextTab) => el.value = translateTextTab[0], HTMLInputElement);
}

export { createInputHtml };

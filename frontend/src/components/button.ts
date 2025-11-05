import { TranslationKey } from "../lang/lang.js";
import { createHtmlData, createTranslatableElement } from "./utils.js";

function createButtonHtml(keyTab: TranslationKey[], id: string, attributeList: Record<string, string> = {}): string {
	const button = createButton(keyTab, id, attributeList);
	return button.outerHTML;
}

function createButton(keyTab: TranslationKey[], id: string, attributeList: Record<string, string> = {}): HTMLButtonElement {
	const htmlData = createHtmlData("button", keyTab, id, attributeList);
	return createTranslatableElement(htmlData, (el, translateTextTab) => el.textContent = translateTextTab[0], HTMLButtonElement);
}

export { createButtonHtml };

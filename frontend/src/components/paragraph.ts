import { TranslationKey } from "../lang/lang.js";
import { createHtmlData, createTranslatableElement } from "./component_utils.js";

function createParagraphHtml(keyTab: TranslationKey[], id: string, attributeList: Record<string, string> = {}): string {
	const paragraph = createParagraph(keyTab, id, attributeList);
	return paragraph.outerHTML;
}

function createParagraph(keyTab: TranslationKey[], id: string, attributeList: Record<string, string> = {}): HTMLParagraphElement {
	const htmlData = createHtmlData("p", keyTab, id, attributeList);
	return createTranslatableElement(htmlData, (el, translateTextTab) => el.textContent = translateTextTab[0], HTMLParagraphElement);
}

export { createParagraph, createParagraphHtml };

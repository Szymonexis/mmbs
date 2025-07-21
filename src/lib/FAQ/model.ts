const faqTranslationPrefix = 'aboutUs.faq.items';

export const FAQ_ITEMS = new Array(8).fill(0).map((_, i) => ({
	question: `${faqTranslationPrefix}.${i}.question`,
	answer: `${faqTranslationPrefix}.${i}.answer`
}));

const serviceCardImageSrcPrefix = '/services';
const serviceCardImageSrcs = [
	`${serviceCardImageSrcPrefix}/web-design.webp`,
	`${serviceCardImageSrcPrefix}/ecommerce.webp`,
	`${serviceCardImageSrcPrefix}/seo-sem.webp`,
	`${serviceCardImageSrcPrefix}/identification.webp`,
	`${serviceCardImageSrcPrefix}/design.webp`,
	`${serviceCardImageSrcPrefix}/apps.webp`
] as const;

const serviceCardTranslationPrefix = 'services.cards';
export const SERVICE_CARDS = new Array(6).fill(0).map((_, i) => ({
	title: `${serviceCardTranslationPrefix}.${i}.title`,
	description: `${serviceCardTranslationPrefix}.${i}.description`,
	image: {
		src: serviceCardImageSrcs[i],
		alt: `${serviceCardTranslationPrefix}.${i}.image.alt`
	}
}));

const howItWorksStepTranslationPrefix = 'services.howItWorks.steps';
export const HOW_IT_WORKS_STEPS = new Array(9).fill(0).map((_, i) => ({
	title: `${howItWorksStepTranslationPrefix}.${i}.title`,
	description: `${howItWorksStepTranslationPrefix}.${i}.description`
}));

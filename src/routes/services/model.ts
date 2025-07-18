const serviceCardImageSrcPrefix = '/services';
const serviceCardImageSrcs = [
	`${serviceCardImageSrcPrefix}/web-design.png`,
	`${serviceCardImageSrcPrefix}/ecommerce.png`,
	`${serviceCardImageSrcPrefix}/seo-sem.png`,
	`${serviceCardImageSrcPrefix}/identification.png`,
	`${serviceCardImageSrcPrefix}/design.png`,
	`${serviceCardImageSrcPrefix}/apps.png`
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

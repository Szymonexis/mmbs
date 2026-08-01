const serviceCardImageSrcPrefix = '/services';

/** Card image sources, in the same order as `services.cards` in the dictionary. */
export const SERVICE_CARD_IMAGE_SRCS = [
	`${serviceCardImageSrcPrefix}/web-design.webp`,
	`${serviceCardImageSrcPrefix}/ecommerce.webp`,
	`${serviceCardImageSrcPrefix}/seo-sem.webp`,
	`${serviceCardImageSrcPrefix}/identification.webp`,
	`${serviceCardImageSrcPrefix}/design.webp`,
	`${serviceCardImageSrcPrefix}/apps.webp`
] as const;

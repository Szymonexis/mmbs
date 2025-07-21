const memberTranslationPrefix = 'aboutUs.ourTeam.members';
const membersOrder = [
	{
		key: 'maja',
		image: 'maja.jpeg',
		descriptionPartsAmount: 2,
		links: [
			{
				name: 'LinkedIn',
				href: 'https://www.linkedin.com/in/maja-irzykowska-owczarek-24679519a/'
			},
			{
				name: 'Instagram',
				href: 'https://www.instagram.com/mio_grafika'
			}
		]
	},
	{
		key: 'bartek',
		image: 'bartek.jpeg',
		descriptionPartsAmount: 2,
		links: [
			{
				name: 'LinkedIn',
				href: 'https://www.linkedin.com/in/bartosz-b%C5%82aszczyk-181135256/'
			}
		]
	},
	{
		key: 'maciej',
		image: 'maciej.jpeg',
		descriptionPartsAmount: 2,
		links: [
			{
				name: 'LinkedIn',
				href: 'https://www.linkedin.com/in/maciej-luci%C5%84ski-02872b216/'
			},
			{
				name: 'GitHub',
				href: 'https://github.com/Vyvr'
			}
		]
	},
	{
		key: 'szymon',
		image: 'szymon.jpeg',
		descriptionPartsAmount: 2,
		links: [
			{
				name: 'LinkedIn',
				href: 'https://www.linkedin.com/in/szymon-kaszuba-ga%C5%82ka/'
			},
			{
				name: 'GitHub',
				href: 'https://github.com/Szymonexis'
			},
			{
				name: 'Digibate',
				href: 'https://digibate.com/'
			}
		]
	}
];

export const MEMBERS = membersOrder.map(({ key, image, links, descriptionPartsAmount }) => ({
	name: `${memberTranslationPrefix}.${key}.name`,
	position: `${memberTranslationPrefix}.${key}.position`,
	descriptionParts: new Array(descriptionPartsAmount)
		.fill(0)
		.map((_, i) => `${memberTranslationPrefix}.${key}.descriptionParts.${i}`),
	image: `/people/${image}`,
	links
}));


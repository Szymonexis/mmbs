const memberTranslationPrefix = 'home.ourTeam.members';
const membersOrder = [
	{
		key: 'maciej',
		image: 'maciej.webp',
		descriptionPartsAmount: 2,
		links: [
			{
				name: 'LinkedIn',
				icon: '/links/linkedin.svg',
				href: 'https://www.linkedin.com/in/maciej-luci%C5%84ski-02872b216/'
			},
			{
				name: 'GitHub',
				icon: '/links/github.svg',
				href: 'https://github.com/Vyvr'
			}
		]
	},
	{
		key: 'maja',
		image: 'maja.webp',
		descriptionPartsAmount: 2,
		links: [
			{
				name: 'LinkedIn',
				icon: '/links/linkedin.svg',
				href: 'https://www.linkedin.com/in/maja-irzykowska-owczarek-24679519a/'
			},
			{
				name: 'Instagram',
				icon: '/links/instagram.svg',
				href: 'https://www.instagram.com/mio_grafika'
			}
		]
	},
	{
		key: 'bartek',
		image: 'bartek.webp',
		descriptionPartsAmount: 2,
		links: [
			{
				name: 'LinkedIn',
				icon: '/links/linkedin.svg',
				href: 'https://www.linkedin.com/in/bartosz-b%C5%82aszczyk-181135256/'
			}
		]
	},
	{
		key: 'szymon',
		image: 'szymon.webp',
		descriptionPartsAmount: 2,
		links: [
			{
				name: 'LinkedIn',
				icon: '/links/linkedin.svg',
				href: 'https://www.linkedin.com/in/szymon-kaszuba-ga%C5%82ka/'
			},
			{
				name: 'GitHub',
				icon: '/links/github.svg',
				href: 'https://github.com/Szymonexis'
			},
			{
				name: 'Digibate',
				icon: '/links/digibate.svg',
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

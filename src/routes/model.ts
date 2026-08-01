import type { TranslationDictionary } from '$i18n';

type MemberKey = keyof TranslationDictionary['home']['ourTeam']['members'];

export const MEMBERS: {
	key: MemberKey;
	image: string;
	links: { name: string; icon: string; href: string }[];
}[] = [
	{
		key: 'maciej',
		image: '/people/maciej.webp',
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
		image: '/people/maja.webp',
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
		image: '/people/bartek.webp',
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
		image: '/people/szymon.webp',
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

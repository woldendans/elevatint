export interface Palette {
	name: string;
	colors: string[];
	ground: number;
	custom?: boolean;
	id: string;
}

export const palettes: Palette[] = [
	{
		id: 'cptcity_mby',
		name: 'Globe',
		colors: [
			'#000064',
			'#001496',
			'#0A32B4',
			'#1E64D2',
			'#50A0F0',
			'#96D2FF',
			'#008000',
			'#22A022',
			'#5AB93C',
			'#A0C85A',
			'#D2D278',
			'#DCB95A',
			'#C39641',
			'#A56932',
			'#825032',
			'#B49B8C',
			'#DCD7D7',
			'#FFFFFF'
		],
		ground: 6
	},
	{
		id: 'Earth',
		name: 'Earth',
		colors: [
			'#0A0079',
			'#1A00B4',
			'#2633C5',
			'#2D5AD2',
			'#3380DC',
			'#4099E4',
			'#59B3ED',
			'#80CCF5',
			'#A6E0FC',
			'#CCF4FF',
			'#0A640A',
			'#288C28',
			'#5AAA3C',
			'#8CB95A',
			'#BEC878',
			'#D2B96E',
			'#C3A04B',
			'#AA8232',
			'#915A32',
			'#AFAFAF',
			'#D2D2D2',
			'#FFFFFF'
		],
		ground: 10
	},
	{
		id: 'Atlantic',
		name: 'Atlantic',
		colors: [
			'#08306b',
			'#1a6faf',
			'#4eb3d3',
			'#9ecae1',
			'#c6dbef',
			'#78c679',
			'#c5e87a',
			'#f7f787',
			'#e8c46a',
			'#d4904e',
			'#8c510a',
			'#f5f5f5'
		],
		ground: 5
	},
	{
		id: 'Pacific',
		name: 'Pacific',
		colors: [
			'#80a9cc',
			'#93b6d6',
			'#a1c3df',
			'#aecce7',
			'#bad6ee',
			'#c5e0f4',
			'#cfe8f9',
			'#dbf0fd',
			'#add1a6',
			'#95c08c',
			'#a9c790',
			'#becd97',
			'#d2d8ac',
			'#e2e5b7',
			'#efecc1',
			'#e9e2b7',
			'#dfd7a4',
			'#d4cb9e',
			'#cfc390',
			'#cbba83',
			'#c4a86b',
			'#c19b52',
			'#bf924a',
			'#bd883f',
			'#b47b00'
		],
		ground: 8
	},
	{
		id: 'DEM3',
		name: 'Highland',
		colors: [
			'#14A014',
			'#32B432',
			'#5AC83C',
			'#8CD25A',
			'#BEDC82',
			'#DCDC96',
			'#E6C878',
			'#D7AA50',
			'#C38C3C',
			'#AA6E32',
			'#965A2D',
			'#B98C73',
			'#C8AF9B',
			'#D7D2C8',
			'#EBEBEB',
			'#FFFFFF'
		],
		ground: 0
	},
	{
		id: 'cptcity_wiki_schwarzwald',
		name: 'Schwarzwald',
		colors: [
			'#337755',
			'#448C53',
			'#55A050',
			'#78B450',
			'#9DCA6D',
			'#C1DA9B',
			'#D5DEA9',
			'#DAD4A8',
			'#DEC494',
			'#D2A875',
			'#C4925A',
			'#B77B4D',
			'#AD6B49',
			'#C7AC98',
			'#DACBBE',
			'#EBE1DC',
			'#F5F0F0',
			'#FFFFFF'
		],
		ground: 0
	},
	{
		id: 'cptcity_dem_poster',
		name: 'Topo',
		colors: [
			'#006C35',
			'#0E8735',
			'#3BAB35',
			'#8DC44E',
			'#C4D483',
			'#DAC87E',
			'#D1AB59',
			'#B98542',
			'#9D6131',
			'#824123',
			'#B9A596',
			'#D2CDCD',
			'#FFFFFF'
		],
		ground: 0
	},
	{
		id: 'imhof_style',
		name: 'Pastel',
		colors: [
			'#AFD2A5',
			'#B9D79B',
			'#C3D791',
			'#C8D28C',
			'#CDCD8C',
			'#D2C88C',
			'#D2BE87',
			'#CDAF7D',
			'#C3A073',
			'#B9946C',
			'#AF8762',
			'#B9A08C',
			'#C8B9AA',
			'#D7CDC8',
			'#E8E4E4',
			'#F8F8FA'
		],
		ground: 0
	},
	{
		id: 'natural_earth_hypso',
		name: 'Natural Earth',
		colors: [
			'#ACD0A5',
			'#94BF8B',
			'#A8C68F',
			'#BDCC96',
			'#D1D7AB',
			'#DCDCB9',
			'#D4CFB4',
			'#D4C1A9',
			'#D4B99E',
			'#D4AD91',
			'#D49E82',
			'#D49478',
			'#CAA594',
			'#D4BCB2',
			'#E1D2CD',
			'#F0EBEB',
			'#FFFFFF'
		],
		ground: 0
	},
	{
		id: 'Desert',
		name: 'Desert',
		colors: [
			'#3a7a9c',
			'#eadaaa',
			'#d4b86e',
			'#c89838',
			'#b87028',
			'#9a4e1e',
			'#7a3c18',
			'#b0a488'
		],
		ground: 1
	},
	{
		id: 'cptcity_arid',
		name: 'Dune',
		colors: [
			'#D2C39B',
			'#CDB98C',
			'#C8AF7D',
			'#C3A56E',
			'#BE9B5F',
			'#B99455',
			'#B48C4B',
			'#B99450',
			'#BE9B5A',
			'#B99155',
			'#AF824B',
			'#A57341',
			'#9B7D5F',
			'#B4AAA0',
			'#D2CDCD',
			'#F5F5F5'
		],
		ground: 0
	},
	{
		id: 'Viridis',
		name: 'Viridis',
		colors: [
			'#440d54',
			'#481568',
			'#482677',
			'#453781',
			'#3f4788',
			'#39558c',
			'#32648e',
			'#2d708e',
			'#277d8e',
			'#238a8d',
			'#1f968b',
			'#20a386',
			'#29af7f',
			'#3cbc75',
			'#56c667',
			'#74d055',
			'#94d840',
			'#b8de29',
			'#dce317',
			'#fde725'
		],
		ground: 0
	}
];

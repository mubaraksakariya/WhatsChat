/** @type {import('tailwindcss').Config} */
import defaultColors from 'tailwindcss/colors';
export default {
	content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
	theme: {
		extend: {},
		colors: {
			...defaultColors,
			themeBlue: '#111B21',
			themeBlueSecondary: '#1d3d51',
			themeGreen: '#00A884',
			themeGreenButton1: '#15803d',
			themeGreenButton2: '#14532d',
			themeGreenButton3: '#052e16',
			themeError: '#E02424',
			white: '#FFFFFF',
		},
	},
	plugins: [],
	darkMode: 'class',
};

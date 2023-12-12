/** @type {import('tailwindcss').Config} */
export default {
	content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
	theme: {
		extend: {},
		colors: {
			themeBlue: '#111B21',
			themeGreen: '#00A884',
			themeGreenButton1: '#008040',
			themeGreenButton2: '#008040',
			themeGreenButton3: '#008050',
			themeError: '#E02424',
			white: '#FFFFFF',
		},
	},
	plugins: [],
	darkMode: 'class',
};

/** @type {import('tailwindcss').Config} */
import defaultColors from 'tailwindcss/colors';
export default {
	content: [
		'./index.html',
		'./src/**/*.{vue,js,ts,jsx,tsx}',
		'node_modules/flowbite-react/lib/esm/**/*.js',
	],
	theme: {
		extend: {
			animation: {
				'slide-in': 'slideIn 0.2s ease-out',
				'slide-out': 'slideOut 0.2s ease-out',
				'fade-in-out': 'fadeInOut 1s ease-in-out infinite',
			},
			keyframes: {
				slideIn: {
					'0%': {
						transform: 'translateX(100%)',
					},
					'100%': {
						transform: 'translateX(0)',
					},
				},
				slideOut: {
					'0%': {
						transform: 'translateX(0)',
					},
					'100%': {
						transform: 'translateX(100%)',
					},
				},
				fadeInOut: {
					'0%, 100%': {
						opacity: 0,
					},
					'50%': {
						opacity: 1,
					},
				},
			},
		},
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
			themChat1: '#005c4b',
			themChat2: '#202c33',
			themeText1: '#dce5e6',
			themeText2: '#687175',
		},
	},
	plugins: [require('flowbite/plugin')],
	darkMode: 'class',
};

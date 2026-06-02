/** @type {import('tailwindcss').Config} */
export default {
	darkMode: ["class"],
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		screens: {
			'2xs': '180px',
			'xs': '320px',
			'sm': '640px',
			'md': '768px',
			'lg': '1024px',
			'xl': '1280px',
			'2xl': '1536px',
		},
		extend: {
			borderRadius: {
				lg: '12px',
				md: '8px',
				sm: '4px',
				'xl': '0.75rem',
				'2xl': '1rem',
				'3xl': '1.5rem',
			},
			colors: {
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				primary: {
					DEFAULT: '#003d9b',
					foreground: '#ffffff',
					container: '#0052cc',
					fixed: '#dae2ff',
					'fixed-dim': '#b2c5ff'
				},
				secondary: {
					DEFAULT: '#006e1c',
					foreground: '#ffffff',
					container: '#91f78e',
					fixed: '#94f990',
					'fixed-dim': '#78dc77'
				},
				tertiary: {
					DEFAULT: '#3b463e',
					foreground: '#ffffff',
					container: '#525e55',
					fixed: '#d9e6da',
					'fixed-dim': '#bdcabe'
				},
				muted: {
					DEFAULT: '#f2f2f2',
					foreground: '#616161'
				},
				accent: {
					DEFAULT: '#f2f2f2',
					foreground: '#000000'
				},
				destructive: {
					DEFAULT: '#a4262c',
					foreground: '#ffffff'
				},
				border: '#e6e6e6',
				input: '#e6e6e6',
				ring: '#003d9b',
				'on-primary': '#ffffff',
				'on-secondary': '#ffffff',
				'on-tertiary': '#ffffff',
				'on-surface': '#191c1d',
				'on-background': '#191c1d',
				'on-primary-container': '#c4d2ff',
				'on-secondary-container': '#00731e',
				'on-tertiary-container': '#cad7cb',
				'on-primary-fixed': '#001848',
				'on-primary-fixed-variant': '#0040a2',
				'on-secondary-fixed': '#002204',
				'on-secondary-fixed-variant': '#005313',
				'on-tertiary-fixed': '#131e17',
				'on-tertiary-fixed-variant': '#3e4a41',
				'on-surface-variant': '#434654',
				'inverse-surface': '#2e3132',
				'inverse-on-surface': '#f0f1f2',
				'inverse-primary': '#b2c5ff',
				'error': '#ba1a1a',
				'on-error': '#ffffff',
				'error-container': '#ffdad6',
				'on-error-container': '#93000a',
				'surface': '#f8f9fa',
				'surface-dim': '#d9dadb',
				'surface-bright': '#f8f9fa',
				'surface-container': '#edeeef',
				'surface-container-lowest': '#ffffff',
				'surface-container-low': '#f3f4f5',
				'surface-container-high': '#e7e8e9',
				'surface-container-highest': '#e1e3e4',
				'surface-variant': '#e1e3e4',
				'surface-tint': '#0c56d0',
				'outline': '#737685',
				'outline-variant': '#c3c6d6',
				chart: {
					'1': 'hsl(var(--chart-1))',
					'2': 'hsl(var(--chart-2))',
					'3': 'hsl(var(--chart-3))',
					'4': 'hsl(var(--chart-4))',
					'5': 'hsl(var(--chart-5))'
				}
			},
			fontFamily: {
				headline: ['Manrope', 'sans-serif'],
				body: ['Inter', 'sans-serif'],
				label: ['Inter', 'sans-serif']
			},
			boxShadow: {
				'atmospheric': '0px 20px 40px rgba(25, 28, 29, 0.04)',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
};

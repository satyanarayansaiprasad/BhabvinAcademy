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
				sm: '4px'
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
					DEFAULT: '#0067b8',
					foreground: '#ffffff'
				},
				secondary: {
					DEFAULT: '#f2f2f2',
					foreground: '#000000'
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
				ring: '#0067b8',
				chart: {
					'1': 'hsl(var(--chart-1))',
					'2': 'hsl(var(--chart-2))',
					'3': 'hsl(var(--chart-3))',
					'4': 'hsl(var(--chart-4))',
					'5': 'hsl(var(--chart-5))'
				}
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
};

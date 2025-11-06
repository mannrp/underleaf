/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
  	extend: {
  		// Sharp design: remove default rounded corners
  		borderRadius: {
  			none: '0',
  			DEFAULT: '0',
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		colors: {
  			// Theme system colors
  			bg: {
  				primary: 'var(--color-bg-primary)',
  				secondary: 'var(--color-bg-secondary)',
  				tertiary: 'var(--color-bg-tertiary)',
  			},
  			text: {
  				primary: 'var(--color-text-primary)',
  				secondary: 'var(--color-text-secondary)',
  				tertiary: 'var(--color-text-tertiary)',
  			},
  			accent: {
  				primary: 'var(--color-accent-primary)',
  				success: 'var(--color-accent-success)',
  				warning: 'var(--color-accent-warning)',
  				error: 'var(--color-accent-error)',
  			},
  			border: 'var(--color-border)',
  			
  			// shadcn/ui compatibility colors
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
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		// Glass effect utilities
  		backdropBlur: {
  			glass: 'var(--glass-blur)',
  		},
  		opacity: {
  			glass: 'var(--glass-opacity)',
  		},
  		spacing: {
  			xs: 'var(--spacing-xs)',
  			sm: 'var(--spacing-sm)',
  			md: 'var(--spacing-md)',
  			lg: 'var(--spacing-lg)',
  			xl: 'var(--spacing-xl)',
  		},
  		fontFamily: {
  			sans: 'var(--font-family-sans)',
  			mono: 'var(--font-family-mono)',
  		},
  		fontSize: {
  			xs: 'var(--font-size-xs)',
  			sm: 'var(--font-size-sm)',
  			base: 'var(--font-size-base)',
  			lg: 'var(--font-size-lg)',
  			xl: 'var(--font-size-xl)',
  			'2xl': 'var(--font-size-2xl)',
  		},
  	}
  },
  plugins: [require("tailwindcss-animate")],
}
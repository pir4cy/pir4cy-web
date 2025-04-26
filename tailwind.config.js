/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        grotesk: ['"Space Grotesk"', 'sans-serif']
      },
      colors: {
        primary: {
          50: '#F0F4FF',
          100: '#E0E9FF',
          200: '#C7D7FF',
          300: '#A5BDFF',
          400: '#819EFF',
          500: '#5C7DFF',
          600: '#3F58FF',
          700: '#303EDB',
          800: '#2430AD',
          900: '#1A2380',
          950: '#0F1342'
        },
        secondary: {
          50: '#F2FDF9',
          100: '#E6FBF3',
          200: '#BFF5E0',
          300: '#99EED0',
          400: '#4DDBAC',
          500: '#14C488',
          600: '#0FAF79',
          700: '#0C8C61',
          800: '#0A6F4C',
          900: '#085B3F',
          950: '#042F20'
        },
        accent: {
          50: '#FFF5F0',
          100: '#FFEAE0',
          200: '#FFCFB5',
          300: '#FFB08A',
          400: '#FF8F5A',
          500: '#FF6B2B',
          600: '#FE4A00',
          700: '#D03B00',
          800: '#A13000',
          900: '#832700',
          950: '#461500'
        },
        success: {
          50: '#F0FDF4',
          100: '#DCFCE7',
          500: '#22C55E',
          700: '#15803D'
        },
        warning: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          500: '#F59E0B',
          700: '#B45309'
        },
        error: {
          50: '#FEF2F2',
          100: '#FEE2E2',
          500: '#EF4444',
          700: '#B91C1C'
        },
        dark: {
          50: '#FAFAFA',
          100: '#F5F5F5',
          200: '#E5E5E5',
          300: '#D4D4D4',
          400: '#A3A3A3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
          950: '#0A0A0A'
        }
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
        '6xl': '3rem'
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '100ch',
            color: 'var(--tw-prose-body)',
            '[class~="lead"]': {
              color: 'var(--tw-prose-lead)'
            },
            strong: {
              color: 'var(--tw-prose-bold)',
              fontWeight: '700'
            },
            'a': {
              color: 'var(--tw-prose-links)',
              textDecoration: 'underline',
              fontWeight: '500',
            },
            'a:hover': {
              color: 'var(--tw-prose-links-hover)',
            },
            'h1, h2, h3, h4, h5, h6': {
              fontFamily: 'Space Grotesk, sans-serif',
              fontWeight: '700',
            },
            'ul > li::marker': {
              color: 'var(--tw-prose-bullets)',
            },
            hr: {
              borderColor: 'var(--tw-prose-hr)',
              borderWidth: '1px',
            },
            blockquote: {
              fontWeight: '500',
              fontStyle: 'italic',
              color: 'var(--tw-prose-quotes)',
              borderLeftWidth: '0.25rem',
              borderLeftColor: 'var(--tw-prose-quote-borders)',
              paddingLeft: '1rem',
            },
            'h1, h2, h3, h4, h5, h6': {
              color: 'var(--tw-prose-headings)',
            },
            'h1': {
              fontSize: '2.25em',
              marginTop: '0',
              marginBottom: '0.8888889em',
              lineHeight: '1.1111111',
            },
            'h2': {
              fontSize: '1.5em',
              marginTop: '2em',
              marginBottom: '1em',
              lineHeight: '1.3333333',
            },
            'h3': {
              fontSize: '1.25em',
              marginTop: '1.6em',
              marginBottom: '0.6em',
              lineHeight: '1.6',
            },
            'h4': {
              marginTop: '1.5em',
              marginBottom: '0.5em',
              lineHeight: '1.5',
            },
            'code': {
              color: 'var(--tw-prose-code)',
              fontWeight: '600',
              fontSize: '0.875em',
            },
            'code::before': {
              content: '"`"',
            },
            'code::after': {
              content: '"`"',
            },
            'pre': {
              color: 'var(--tw-prose-pre-code)',
              backgroundColor: 'var(--tw-prose-pre-bg)',
              overflowX: 'auto',
              fontWeight: '400',
              fontSize: '0.875em',
              lineHeight: '1.7142857',
              borderRadius: '0.75rem',
              paddingTop: '0.8571429em',
              paddingRight: '1.1428571em',
              paddingBottom: '0.8571429em',
              paddingLeft: '1.1428571em',
            },
            'pre code': {
              backgroundColor: 'transparent',
              borderWidth: '0',
              borderRadius: '0',
              padding: '0',
              fontWeight: 'inherit',
              color: 'inherit',
              fontSize: 'inherit',
              fontFamily: 'inherit',
              lineHeight: 'inherit',
            },
            'pre code::before': {
              content: 'none',
            },
            'pre code::after': {
              content: 'none',
            },
          },
        },
      },
    },
  },
  plugins: [],
};
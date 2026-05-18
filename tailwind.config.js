/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          light:   '#E8C97A',
          DEFAULT: '#C9A84C',
          dark:    '#A07828',
        },
        canvas:   '#000000',
        surface: {
          soft:     '#0d0d0d',
          card:     '#111111',
          elevated: '#1a1a1a',
        },
        hairline: '#2a2a2a',
        ink:      '#ffffff',
        body:     '#bbbbbb',
        muted:    '#7e7e7e',
        success:  '#0fa336',
        warning:  '#f4b400',
        danger:   '#e22718',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      fontSize: {
        'display-xl': ['72px', { lineHeight: '1',    fontWeight: '700' }],
        'display-lg': ['48px', { lineHeight: '1.05', fontWeight: '700' }],
        'display-md': ['36px', { lineHeight: '1.1',  fontWeight: '700' }],
        'display-sm': ['28px', { lineHeight: '1.15', fontWeight: '700' }],
        'title-lg':   ['24px', { lineHeight: '1.3',  fontWeight: '700' }],
        'title-md':   ['20px', { lineHeight: '1.4',  fontWeight: '400' }],
        'title-sm':   ['18px', { lineHeight: '1.4',  fontWeight: '400' }],
        'label':      ['13px', { lineHeight: '1.3',  fontWeight: '700' }],
        'body-md':    ['16px', { lineHeight: '1.5',  fontWeight: '300' }],
        'body-sm':    ['14px', { lineHeight: '1.5',  fontWeight: '300' }],
        'caption':    ['12px', { lineHeight: '1.4',  fontWeight: '400' }],
      },
      letterSpacing: {
        'machined': '1.5px',
        'wide':     '0.5px',
      },
      spacing: {
        'xxs': '4px',
        'xs':  '8px',
        'sm':  '12px',
        'md':  '16px',
        'lg':  '24px',
        'xl':  '40px',
        'xxl': '64px',
        'section': '96px',
      },
      borderRadius: {
        'none': '0px',
        'full': '9999px',
      },
      height: {
        'nav':    '64px',
        'btn':    '48px',
        'input':  '48px',
        'stripe': '4px',
      },
    },
  },
  plugins: [],
}
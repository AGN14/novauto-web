export const DESIGN_TOKENS = {
  colors: {
    gold: {
      light:   '#E8C97A',
      default: '#C9A84C',
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
  spacing: {
    xxs:     '4px',
    xs:      '8px',
    sm:      '12px',
    md:      '16px',
    lg:      '24px',
    xl:      '40px',
    xxl:     '64px',
    section: '96px',
  },
} as const;

export type DesignTokens = typeof DESIGN_TOKENS;
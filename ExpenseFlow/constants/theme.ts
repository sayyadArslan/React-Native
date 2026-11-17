export const Colors = {
  // Core Brand Colors
  background: '#0A0A0A',
  backgroundSecondary: '#111111',
  backgroundCard: '#161616',
  backgroundElevated: '#1C1C1C',

  // Gold Palette
  gold: '#D4AF37',
  goldLight: '#F0D060',
  goldDark: '#A07820',
  goldMuted: '#8B6914',
  goldAccent: '#FFD700',

  // Text
  textPrimary: '#FFFFFF',
  textSecondary: '#AAAAAA',
  textMuted: '#666666',
  textGold: '#D4AF37',

  // Status
  income: '#4CAF50',
  incomeLight: '#81C784',
  expense: '#EF5350',
  expenseLight: '#EF9A9A',
  warning: '#FF9800',
  info: '#2196F3',

  // UI Elements
  border: '#2A2A2A',
  borderGold: '#D4AF3740',
  divider: '#1E1E1E',
  overlay: 'rgba(0,0,0,0.7)',

  // Gradients (use as array for LinearGradient)
  gradientGold: ['#D4AF37', '#A07820'],
  gradientDark: ['#1C1C1C', '#0A0A0A'],
  gradientCard: ['#1C1C1C', '#111111'],
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999,
};

export const Shadows = {
  gold: {
    shadowColor: '#D4AF37',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  dark: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 10,
  },
  card: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 6,
  },
};
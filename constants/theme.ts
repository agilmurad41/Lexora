// Lexora Theme - Liquid Glass iOS 26 Style
export const theme = {
  // Primary Colors - Vibrant Blue
  primary: '#007AFF',
  primaryLight: '#5AC8FA',
  primaryDark: '#0055D4',
  
  // Accent Colors - Vibrant Gradients
  accent: '#30D158',
  accentLight: '#5DEF85',
  accentDark: '#248A3D',
  
  // Secondary accent - Purple/Pink
  secondary: '#BF5AF2',
  secondaryLight: '#DA8FFF',
  secondaryDark: '#9B4DCA',
  
  // Tertiary - Orange/Coral
  tertiary: '#FF9F0A',
  tertiaryLight: '#FFB340',
  tertiaryDark: '#C77800',
  
  // Premium/Gold
  gold: '#FFD60A',
  goldLight: '#FFE657',
  goldDark: '#B89500',
  
  // Backgrounds - Liquid Glass
  background: '#000000',
  backgroundSecondary: '#0D0D0D',
  backgroundTertiary: '#1C1C1E',
  surface: 'rgba(28, 28, 30, 0.65)',
  surfaceLight: 'rgba(44, 44, 46, 0.65)',
  surfaceElevated: 'rgba(58, 58, 60, 0.5)',
  
  // Glass Effect - Liquid Glass style
  glass: 'rgba(255, 255, 255, 0.08)',
  glassBorder: 'rgba(255, 255, 255, 0.15)',
  glassHighlight: 'rgba(255, 255, 255, 0.25)',
  glassActive: 'rgba(255, 255, 255, 0.12)',
  
  // Text
  textPrimary: '#FFFFFF',
  textSecondary: 'rgba(235, 235, 245, 0.6)',
  textMuted: 'rgba(235, 235, 245, 0.3)',
  
  // Status Colors - iOS vibrant
  success: '#30D158',
  error: '#FF453A',
  warning: '#FFD60A',
  info: '#5AC8FA',
  
  // Game Specific - Colorful
  letterBg: 'rgba(0, 122, 255, 0.3)',
  letterBgActive: 'rgba(0, 122, 255, 0.8)',
  letterBgFound: 'rgba(48, 209, 88, 0.8)',
  wheelBg: 'rgba(0, 122, 255, 0.1)',
  wheelCenter: 'rgba(0, 0, 0, 0.8)',
  
  // New Liquid Glass Colors
  cyan: '#64D2FF',
  mint: '#63E6BE',
  pink: '#FF6B9D',
  indigo: '#5E5CE6',
  teal: '#40C8E0',
  coral: '#FF6259',
  
  // Gradients (as arrays for LinearGradient)
  gradients: {
    primary: ['#007AFF', '#5856D6'],
    accent: ['#30D158', '#248A3D'],
    gold: ['#FFD60A', '#FF9F0A'],
    dark: ['#1C1C1E', '#000000'],
    purple: ['#BF5AF2', '#5E5CE6'],
    premium: ['#AF52DE', '#5856D6'],
    sunset: ['#FF9F0A', '#FF6259'],
    ocean: ['#5AC8FA', '#007AFF'],
    aurora: ['#30D158', '#64D2FF', '#BF5AF2'],
    liquidGlass: ['rgba(255,255,255,0.15)', 'rgba(255,255,255,0.05)'],
    vibrant: ['#FF6B9D', '#BF5AF2', '#5856D6'],
  },
  
  // Spacing
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  
  // Border Radius - More rounded for iOS 26
  borderRadius: {
    sm: 10,
    md: 14,
    lg: 20,
    xl: 28,
    xxl: 36,
    full: 9999,
  },
  
  // Typography
  typography: {
    hero: { fontSize: 48, fontWeight: '700' as const },
    title: { fontSize: 28, fontWeight: '700' as const },
    subtitle: { fontSize: 20, fontWeight: '600' as const },
    body: { fontSize: 16, fontWeight: '400' as const },
    caption: { fontSize: 14, fontWeight: '400' as const },
    small: { fontSize: 12, fontWeight: '500' as const },
    label: { fontSize: 11, fontWeight: '600' as const, letterSpacing: 1 },
  },
};

export const shadows = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
  },
  glow: {
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 24,
    elevation: 15,
  },
  glowAccent: {
    shadowColor: '#30D158',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 12,
  },
  glowPurple: {
    shadowColor: '#BF5AF2',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 12,
  },
  glass: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
};

// Blur intensities for Liquid Glass effect
export const blurIntensity = {
  light: 20,
  medium: 40,
  heavy: 60,
};

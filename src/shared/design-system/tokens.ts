/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Centralized Design System Tokens for ABANGCOLEK-OS
 */

export const OS_TOKENS = {
  colors: {
    bg: 'var(--os-bg, #090A10)',
    surface: 'var(--os-surface, #0D0F19)',
    surfaceElevated: 'var(--os-surface-elevated, #141624)',
    border: 'var(--os-border, rgba(255, 255, 255, 0.08))',
    borderHover: 'var(--os-border-hover, rgba(255, 255, 255, 0.16))',
    text: 'var(--os-text, #F4F4F6)',
    textMuted: 'var(--os-text-muted, #94A3B8)',
    accent: 'var(--os-accent, #CFFF5E)',
    accentSecondary: 'var(--os-accent-secondary, #8C7DFF)',
    success: 'var(--os-success, #10B981)',
    warning: 'var(--os-warning, #FFC107)',
    danger: 'var(--os-danger, #FF4757)',
    info: 'var(--os-info, #00F0FF)',
  },
  radius: {
    sm: '0.5rem',   // 8px
    md: '0.75rem',  // 12px
    lg: '1rem',     // 16px
    xl: '1.5rem',   // 24px
    full: '9999px',
  },
  shadows: {
    subtle: '0 4px 20px rgba(0, 0, 0, 0.4)',
    card: '0 12px 30px rgba(0, 0, 0, 0.6)',
    glowLime: '0 0 20px rgba(207, 255, 94, 0.2)',
    glowRed: '0 0 20px rgba(255, 71, 87, 0.2)',
  }
} as const;

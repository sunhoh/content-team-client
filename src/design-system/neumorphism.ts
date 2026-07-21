/**
 * Neumorphic design-system — TypeScript token layer.
 *
 * All shadow strings reference CSS variables defined in globals.css.
 * Use these when you need
 * box-shadow in a React `style` prop (dynamic press/focus states).
 * For static cases, prefer the Tailwind utilities: neu-raised, neu-inset, etc.
 */

/* ─── CSS-variable references ───────────────────────────────────────── */
export const shadows = {
  raised:   'var(--neu-raised)',
  raisedSm: 'var(--neu-raised-sm)',
  raisedXs: 'var(--neu-raised-xs)',
  inset:    'var(--neu-inset)',
  pressed:  'var(--neu-pressed)',
  focus:    'var(--neu-focus)',
  accent:   'var(--neu-accent-shadow)',
} as const;

export type NeuShadow = keyof typeof shadows;

/** Resolves a shadow variant to its CSS variable string. */
export const neuShadow = (variant: NeuShadow): string => shadows[variant];

/* ─── Tailwind utility class names (static usage) ───────────────────── */
export const neuClass = {
  raised:   'neu-raised',
  raisedSm: 'neu-raised-sm',
  raisedXs: 'neu-raised-xs',
  inset:    'neu-inset',
  pressed:  'neu-pressed',
  surface:  'neu-surface',
  btn:      'neu-btn',
  btnAccent:'neu-btn-accent',
  btnIcon:  'neu-btn-icon',
  input:    'neu-input',
} as const;

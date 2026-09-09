/*
 * Copyright 2026 The Kubermatic Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { describe, expect, it } from 'vitest';

import { CONTRAST_PAIRS } from '../styles/tokens.js';

import { auditThemeContrast, contrastRatio, formatRatio, parseColor } from './contrast.js';

describe('contrastRatio', () => {
  /*
   * Anchored on the two ends of the scale and on published reference values,
   * so a regression in the luminance curve cannot hide behind "the number
   * changed a bit".
   */
  it('spans 1 to 21', () => {
    expect(contrastRatio('#ffffff', '#000000')).toBeCloseTo(21, 5);
    expect(contrastRatio('#7f7f7f', '#7f7f7f')).toBeCloseTo(1, 5);
  });

  it('is symmetric', () => {
    expect(contrastRatio('#001128', '#ffffff')).toBeCloseTo(
      contrastRatio('#ffffff', '#001128'),
      10,
    );
  });

  /*
   * The case the whole palette turns on: brand Cerulean is 0.08 short of the
   * text minimum, and the corrected role clears it. If this stops holding,
   * the correction documented in theme.css is no longer justified by the
   * numbers.
   */
  it('reproduces the Cerulean correction', () => {
    expect(contrastRatio('#0081ae', '#ffffff')).toBeLessThan(4.5);
    expect(contrastRatio('#007daa', '#ffffff')).toBeGreaterThanOrEqual(4.5);
  });

  it('reads the notations getComputedStyle returns', () => {
    const hex = contrastRatio('#007daa', '#ffffff');
    expect(contrastRatio('rgb(0, 125, 170)', 'rgb(255, 255, 255)')).toBeCloseTo(hex, 10);
    expect(contrastRatio('rgb(0 125 170)', 'rgb(255 255 255 / 1)')).toBeCloseTo(hex, 10);
  });

  it('expands shorthand hex', () => {
    expect(contrastRatio('#fff', '#000')).toBeCloseTo(21, 5);
    expect(contrastRatio('#ffff', '#000f')).toBeCloseTo(21, 5);
  });
});

describe('parseColor', () => {
  /*
   * Refusing translucency is the point, not a limitation. `bg-destructive/10`
   * composites against whatever is behind it, so it has no contrast of its
   * own — returning a number for it would be inventing one.
   */
  it.each(['#00000080', 'rgba(0, 0, 0, 0.5)', 'rgb(0 0 0 / 0.5)'])('rejects %s', (value) => {
    expect(() => parseColor(value)).toThrow(/[Tt]ranslucent/);
  });

  it.each(['oklch(0.5 0.1 200)', 'color-mix(in oklch, red, blue)', 'papayawhip', ''])(
    'rejects %s rather than guessing',
    (value) => {
      expect(() => parseColor(value)).toThrow();
    },
  );

  it('rejects malformed hex and rgb', () => {
    expect(() => parseColor('#12345')).toThrow();
    expect(() => parseColor('rgb(1, 2)')).toThrow();
  });

  it('tolerates surrounding whitespace, as computed values carry', () => {
    expect(parseColor('  #007daa ')).toEqual([0, 125, 170]);
  });
});

describe('formatRatio', () => {
  it('quotes two decimals', () => {
    expect(formatRatio(4.6512)).toBe('4.65:1');
    expect(formatRatio(21)).toBe('21.00:1');
  });
});

describe('auditThemeContrast', () => {
  /*
   * jsdom computes custom properties but not Tailwind's stylesheet, so the
   * roles are set inline here — which is exactly the shape `ThemeProvider`
   * writes runtime `tokens` in, and therefore the shape a consumer auditing
   * their own palette will have.
   */
  function mount(values: Record<string, string>): HTMLElement {
    const element = document.createElement('div');
    for (const [role, value] of Object.entries(values)) {
      element.style.setProperty(`--${role}`, value);
    }
    document.body.append(element);
    return element;
  }

  it('reports a passing pair as measured, not failed', () => {
    const element = mount({ background: '#ffffff', foreground: '#001128' });
    const { measured, failures } = auditThemeContrast(element);

    const pair = measured.find((result) => result.pair.foreground === 'foreground');
    expect(pair?.passes).toBe(true);
    expect(pair?.ratio).toBeGreaterThan(18);
    expect(failures).toEqual([]);
  });

  it('catches a custom palette that fails AA', () => {
    // The scenario the export exists for: a tenant primary that looks fine and
    // measures 3.68:1 under white text.
    const element = mount({ primary: '#3b82f6', 'primary-foreground': '#ffffff' });
    const { failures } = auditThemeContrast(element);

    expect(failures).toHaveLength(1);
    expect(failures[0]?.pair.surface).toBe('primary');
    expect(failures[0]?.ratio).toBeLessThan(4.5);
  });

  it('holds non-text roles to 3:1 rather than 4.5:1', () => {
    const element = mount({ background: '#ffffff', border: '#8e939a', ring: '#8e939a' });
    const { failures, measured } = auditThemeContrast(element);

    expect(failures).toEqual([]);
    expect(measured.every((result) => result.ratio < 4.5)).toBe(true);
  });

  it('separates what it could not measure from what failed', () => {
    const element = mount({ background: '#ffffff', foreground: 'rgba(0, 0, 0, 0.4)' });
    const { failures, unmeasured } = auditThemeContrast(element);

    expect(failures).toEqual([]);
    expect(unmeasured.map((entry) => entry.pair.foreground)).toContain('foreground');
    expect(unmeasured[0]?.reason).toMatch(/[Tt]ranslucent/);
  });

  it('skips pairs whose roles are absent instead of throwing', () => {
    const { measured, unmeasured } = auditThemeContrast(mount({}));

    expect(measured).toEqual([]);
    expect(unmeasured).toHaveLength(CONTRAST_PAIRS.length);
  });
});

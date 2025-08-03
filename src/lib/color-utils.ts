/**
 * Convert hex color to RGB values
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: Number.parseInt(result[1], 16),
        g: Number.parseInt(result[2], 16),
        b: Number.parseInt(result[3], 16),
      }
    : null;
}

/**
 * Parses hex and rgb color strings
 */
function parseColor(color: string): { r: number; g: number; b: number } | null {
  if (color.startsWith("#")) {
    // Hex color
    return hexToRgb(color);
  } else if (color.startsWith("rgb")) {
    // RGB color
    const matches = color.match(/\d+/g);
    if (!matches || matches.length < 3) return null;
    const [r, g, b] = matches.map(Number);
    return { r, g, b };
  } else {
    // Unknown color
    return null;
  }
}

/**
 * Calculate the relative luminance of a color
 * Based on WCAG guidelines: https://www.w3.org/WAI/GL/wiki/Relative_luminance
 */
function getLuminance(color: { r: number; g: number; b: number }): number {
  const [rs, gs, bs] = [color.r, color.g, color.b].map((c) => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Determine if a color is light or dark
 * Returns true if the color is light (should use dark text)
 * @param color - The color in hex or rgb format
 */
export function isLightColor(color: string): boolean {
  const parsedColor = parseColor(color);
  if (!parsedColor) {
    return false;
  }

  const luminance = getLuminance(parsedColor!);
  return luminance > 0.5;
}

/**
 * Determine if a color is very light
 * Returns true if the color is very light (should use a different background)
 * @param color - The color in hex or rgb format
 */
export function isVeryLightColor(color: string): boolean {
  const parsedColor = parseColor(color);
  if (!parsedColor) {
    return false;
  }

  const luminance = getLuminance(parsedColor!);
  return luminance > 0.9;
}

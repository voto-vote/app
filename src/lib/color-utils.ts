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
 * Calculate the relative luminance of a color
 * Based on WCAG guidelines: https://www.w3.org/WAI/GL/wiki/Relative_luminance
 */
function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
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
  // Handle different color formats
  let r: number, g: number, b: number;

  if (color.startsWith("#")) {
    // Hex color
    const rgb = hexToRgb(color);
    if (!rgb) return false;
    ({ r, g, b } = rgb);
  } else if (color.startsWith("rgb")) {
    // RGB color
    const matches = color.match(/\d+/g);
    if (!matches || matches.length < 3) return false;
    [r, g, b] = matches.map(Number);
  } else {
    // For other formats, default to dark color
    return false;
  }

  const luminance = getLuminance(r, g, b);
  return luminance > 0.5;
}

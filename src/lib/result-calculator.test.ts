import { describe, it, expect } from "vitest";
import { scaleValueToNormalized } from "./result-calculator";
import { normalizedToScaleValue } from "./result-calculator";

describe("convertDecision", () => {
  describe("scaleValueToNormalized", () => {
    it("returns 0 for the lowest key", () => {
      expect(scaleValueToNormalized(1, 3)).toBe(0);
      expect(scaleValueToNormalized(1, 5)).toBe(0);
    });

    it("returns 99 for the highest key", () => {
      expect(scaleValueToNormalized(3, 3)).toBe(1);
      expect(scaleValueToNormalized(5, 5)).toBe(1);
    });

    it("returns correct percentage for middle keys", () => {
      expect(scaleValueToNormalized(2, 5)).toBe(0.25);
      expect(scaleValueToNormalized(2, 3)).toBe(0.5);
      expect(scaleValueToNormalized(3, 5)).toBe(0.5);
      expect(scaleValueToNormalized(4, 5)).toBe(0.75);
    });

    it("handles keys outside the scale", () => {
      expect(scaleValueToNormalized(6, 5)).toBe(1);
      expect(scaleValueToNormalized(0, 5)).toBe(0);
    });
  });

  describe("normalizedToScaleValue", () => {
    it("returns 1 for rating 0", () => {
      expect(normalizedToScaleValue(0, 3)).toBe(1);
      expect(normalizedToScaleValue(0, 5)).toBe(1);
    });

    it("returns scale for rating 1", () => {
      expect(normalizedToScaleValue(1, 3)).toBe(3);
      expect(normalizedToScaleValue(1, 5)).toBe(5);
    });

    it("returns middle key for rating 0.5", () => {
      expect(normalizedToScaleValue(0.5, 3)).toBe(2);
      expect(normalizedToScaleValue(0.5, 5)).toBe(3);
    });

    it("returns correct key for other ratings", () => {
      expect(normalizedToScaleValue(0.2, 3)).toBe(1);
      expect(normalizedToScaleValue(0.25, 5)).toBe(2);
      expect(normalizedToScaleValue(0.8, 3)).toBe(3);
      expect(normalizedToScaleValue(0.75, 5)).toBe(4);
      expect(normalizedToScaleValue(0.8, 5)).toBe(4);
    });

    it("handles ratings outside 0-99", () => {
      expect(normalizedToScaleValue(-10, 5)).toBe(1);
      expect(normalizedToScaleValue(110, 5)).toBe(5);
    });
  });
});

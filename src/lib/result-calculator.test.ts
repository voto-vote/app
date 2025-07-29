import { describe, it, expect } from "vitest";
import { convertDecisionToRating } from "./result-calculator";
import { convertRatingToDecision } from "./result-calculator";

describe("convertDecision", () => {
  it("returns 0 if scale is 1", () => {
    expect(convertDecisionToRating(1, 1)).toBe(0);
    expect(convertDecisionToRating(5, 1)).toBe(0);
  });

  it("returns 0 for the lowest key", () => {
    expect(convertDecisionToRating(1, 3)).toBe(0);
    expect(convertDecisionToRating(1, 5)).toBe(0);
  });

  it("returns 100 for the highest key", () => {
    expect(convertDecisionToRating(3, 3)).toBe(100);
    expect(convertDecisionToRating(5, 5)).toBe(100);
  });

  it("returns correct percentage for middle keys", () => {
    expect(convertDecisionToRating(2, 5)).toBe(25);
    expect(convertDecisionToRating(2, 3)).toBe(50);
    expect(convertDecisionToRating(3, 5)).toBe(50);
    expect(convertDecisionToRating(4, 5)).toBe(75);
  });

  it("handles scale less than 1", () => {
    expect(convertDecisionToRating(1, 0)).toBe(0);
    expect(convertDecisionToRating(1, -2)).toBe(0);
  });

  it("handles keys outside the scale", () => {
    expect(convertDecisionToRating(6, 5)).toBe(100);
    expect(convertDecisionToRating(0, 5)).toBe(0);
  });

  describe("convertRatingToDecision", () => {
    it("returns 1 if scale is 1", () => {
      expect(convertRatingToDecision(0, 1)).toBe(1);
      expect(convertRatingToDecision(100, 1)).toBe(1);
      expect(convertRatingToDecision(50, 1)).toBe(1);
    });

    it("returns 1 if scale is less than 1", () => {
      expect(convertRatingToDecision(0, 0)).toBe(1);
      expect(convertRatingToDecision(100, -2)).toBe(1);
    });

    it("returns 1 for rating 0", () => {
      expect(convertRatingToDecision(0, 3)).toBe(1);
      expect(convertRatingToDecision(0, 5)).toBe(1);
    });

    it("returns scale for rating 100", () => {
      expect(convertRatingToDecision(100, 3)).toBe(3);
      expect(convertRatingToDecision(100, 5)).toBe(5);
    });

    it("returns middle key for rating 50", () => {
      expect(convertRatingToDecision(50, 3)).toBe(2);
      expect(convertRatingToDecision(50, 5)).toBe(3);
    });

    it("returns correct key for other ratings", () => {
      expect(convertRatingToDecision(20, 3)).toBe(1);
      expect(convertRatingToDecision(25, 5)).toBe(2);
      expect(convertRatingToDecision(80, 3)).toBe(3);
      expect(convertRatingToDecision(75, 5)).toBe(4);
      expect(convertRatingToDecision(80, 5)).toBe(4);
    });

    it("handles ratings outside 0-100", () => {
      expect(convertRatingToDecision(-10, 5)).toBe(1);
      expect(convertRatingToDecision(110, 5)).toBe(5);
    });
  });
});

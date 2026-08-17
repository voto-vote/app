import { describe, it, expect } from "vitest";
import {
  calculateResults,
  normalizedToScaleValue,
  scaleValueToNormalized,
} from "./result-calculator";
import type { Party } from "@/types/party";
import type { Ratings } from "@/types/ratings";

const matrix = [
  [1, 0, -1],
  [0, 0.5, 0],
  [-1, 0, 1],
];

function createParty(ratings: Ratings): Party {
  return {
    id: 1,
    type: "party",
    parentPartyId: 1,
    electionId: 1,
    displayName: "Test party",
    detailedName: "Test party",
    image: "",
    description: "",
    website: undefined,
    status: "voted",
    color: "#000000",
    ratings,
  };
}

function rating(value: number, isFavorite = false): Ratings[string] {
  return { value, isFavorite };
}

describe("calculateResults", () => {
  it("uses each normalized user answer as a distinct matrix position", () => {
    const party = createParty({ thesis: rating(0) });

    expect(
      calculateResults(matrix, [party], { thesis: rating(0) })[0]
        .matchPercentage,
    ).toBe(100);
    expect(
      calculateResults(matrix, [party], { thesis: rating(0.5) })[0]
        .matchPercentage,
    ).toBe(50);
    expect(
      calculateResults(matrix, [party], { thesis: rating(1) })[0]
        .matchPercentage,
    ).toBe(0);
  });

  it("returns different results when the user changes an answer", () => {
    const party = createParty({
      first: rating(0),
      second: rating(1),
    });

    const agreeingResult = calculateResults(matrix, [party], {
      first: rating(0),
      second: rating(1),
    })[0];
    const opposingResult = calculateResults(matrix, [party], {
      first: rating(1),
      second: rating(0),
    })[0];

    expect(agreeingResult.matchPercentage).toBe(100);
    expect(opposingResult.matchPercentage).toBe(0);
  });

  it("weights favorite theses exactly twice", () => {
    const party = createParty({
      matching: rating(0),
      opposing: rating(1),
    });

    const result = calculateResults(matrix, [party], {
      matching: rating(0, true),
      opposing: rating(0),
    })[0];

    expect(result.matchPercentage).toBe(66.7);
  });

  it("excludes skipped and unrated theses", () => {
    const party = createParty({
      included: rating(0),
      skipped: rating(1),
      unrated: rating(1),
    });

    const result = calculateResults(matrix, [party], {
      included: rating(0),
      skipped: { value: "skipped", isFavorite: false },
      unrated: { value: "unrated", isFavorite: false },
    })[0];

    expect(result.matchPercentage).toBe(100);
  });

  it("preserves the configured partial score for neutral agreement", () => {
    const party = createParty({ thesis: rating(0.5) });

    const result = calculateResults(matrix, [party], {
      thesis: rating(0.5),
    })[0];

    expect(result.matchPercentage).toBe(75);
  });
});

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

import { describe, it, expect } from "vitest";
import { migrateV0ToV1 } from "./user-ratings-store";

describe("migrateV0ToV1", () => {
  it("should return empty object for invalid state", () => {
    const result = migrateV0ToV1("invalid");
    expect(result).toEqual({ userRatings: {} });
  });

  it("should return empty object for null state", () => {
    const result = migrateV0ToV1(null);
    expect(result).toEqual({ userRatings: {} });
  });

  it("should return empty object for undefined state", () => {
    const result = migrateV0ToV1(undefined);
    expect(result).toEqual({ userRatings: {} });
  });

  it("should migrate empty userRatings", () => {
    const result = migrateV0ToV1({ userRatings: {} });
    expect(result).toEqual({ userRatings: {} });
  });

  it("should convert rating -1 to 'skipped'", () => {
    const v0State = {
      userRatings: {
        1: {
          10: { rating: -1, favorite: false },
        },
      },
    };
    const result = migrateV0ToV1(v0State);
    expect(result.userRatings[1][10]).toEqual({
      value: "skipped",
      isFavorite: false,
      ratedAt: undefined,
    });
  });

  it("should convert rating 0 to 0", () => {
    const v0State = {
      userRatings: {
        1: {
          10: { rating: 0, favorite: false },
        },
      },
    };
    const result = migrateV0ToV1(v0State);
    expect(result.userRatings[1][10].value).toBe(0);
  });

  it("should convert rating 100 to 1", () => {
    const v0State = {
      userRatings: {
        1: {
          10: { rating: 100, favorite: true },
        },
      },
    };
    const result = migrateV0ToV1(v0State);
    expect(result.userRatings[1][10]).toEqual({
      value: 1,
      isFavorite: true,
      ratedAt: undefined,
    });
  });

  it("should convert rating 50 to 0.5", () => {
    const v0State = {
      userRatings: {
        1: {
          10: { rating: 50, favorite: false },
        },
      },
    };
    const result = migrateV0ToV1(v0State);
    expect(result.userRatings[1][10].value).toBe(0.5);
  });

  it("should clamp rating values above 100 to 1", () => {
    const v0State = {
      userRatings: {
        1: {
          10: { rating: 150, favorite: false },
        },
      },
    };
    const result = migrateV0ToV1(v0State);
    expect(result.userRatings[1][10].value).toBe(1);
  });

  it("should clamp rating values below 0 to 0", () => {
    const v0State = {
      userRatings: {
        1: {
          10: { rating: -50, favorite: false },
        },
      },
    };
    const result = migrateV0ToV1(v0State);
    expect(result.userRatings[1][10].value).toBe(0);
  });

  it("should convert favorite to isFavorite", () => {
    const v0State = {
      userRatings: {
        1: {
          10: { rating: 50, favorite: true },
        },
      },
    };
    const result = migrateV0ToV1(v0State);
    expect(result.userRatings[1][10].isFavorite).toBe(true);
  });

  it("should preserve timestamp as ratedAt", () => {
    const timestamp = 1700000000000;
    const v0State = {
      userRatings: {
        1: {
          10: { rating: 50, favorite: false, timestamp },
        },
      },
    };
    const result = migrateV0ToV1(v0State);
    expect(result.userRatings[1][10].ratedAt).toBe(timestamp);
  });

  it("should handle multiple elections and theses", () => {
    const v0State = {
      userRatings: {
        1: {
          10: { rating: 25, favorite: false },
          11: { rating: -1, favorite: true },
        },
        2: {
          20: { rating: 75, favorite: true, timestamp: 123456 },
        },
      },
    };
    const result = migrateV0ToV1(v0State);

    expect(result.userRatings[1][10]).toEqual({
      value: 0.25,
      isFavorite: false,
      ratedAt: undefined,
    });
    expect(result.userRatings[1][11]).toEqual({
      value: "skipped",
      isFavorite: true,
      ratedAt: undefined,
    });
    expect(result.userRatings[2][20]).toEqual({
      value: 0.75,
      isFavorite: true,
      ratedAt: 123456,
    });
  });

  it("should handle string keys by coercing them to numbers", () => {
    const v0State = {
      userRatings: {
        "1": {
          "10": { rating: 50, favorite: false },
        },
      },
    };
    const result = migrateV0ToV1(v0State);
    expect(result.userRatings[1][10]).toEqual({
      value: 0.5,
      isFavorite: false,
      ratedAt: undefined,
    });
  });

  it("should handle election with no theses", () => {
    const v0State = {
      userRatings: {
        1: {},
      },
    };
    const result = migrateV0ToV1(v0State);
    expect(result.userRatings[1]).toEqual({});
  });
});

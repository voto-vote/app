import { beforeEach, describe, expect, it } from "vitest";
import { useUserRatingsStore } from "@/stores/user-ratings-store";
import { getFinishedEvent, skipUnratedTheses } from "./events";

beforeEach(() => {
  useUserRatingsStore.setState({ userRatings: {} });
});

describe("finished event ratings", () => {
  it("includes a rating updated immediately before finishing", () => {
    const { setUserRatingValue } = useUserRatingsStore.getState();
    setUserRatingValue(4, "11", 0.5);

    expect(getFinishedEvent(4, false).ratings?.[11].value).toBe(0.5);
  });

  it("marks both missing and unrated theses skipped before taking the snapshot", () => {
    const { setUserRatingValue } = useUserRatingsStore.getState();
    setUserRatingValue(4, "11", 0.5);
    setUserRatingValue(4, "12", "unrated");

    skipUnratedTheses(4, ["11", "12", "13"]);
    const ratings = getFinishedEvent(4, true).ratings;

    expect(ratings?.[11].value).toBe(0.5);
    expect(ratings?.[12].value).toBe("skipped");
    expect(ratings?.[13].value).toBe("skipped");
  });
});

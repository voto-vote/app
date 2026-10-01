import { afterEach, describe, expect, it, vi } from "vitest";
import { EventsAPI } from "./api";

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("EventsAPI.createEvent", () => {
  it("sends finished ratings in the backend's 0-100 format and reads the vote ID", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response('"vote-123"', { status: 201 }));
    vi.stubGlobal("fetch", fetchMock);

    const id = await EventsAPI.createEvent({
      electionId: 4,
      eventType: "voto_finished",
      ratings: {
        11: { value: 0.75, isFavorite: true, ratedAt: 123 },
        12: { value: "skipped", isFavorite: false },
        13: { value: "unrated", isFavorite: false },
      },
      metadata: { skippedToResult: false },
    });

    expect(id).toBe("vote-123");
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/events",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          electionId: 4,
          eventType: "voto_finished",
          ratings: {
            11: { rating: 75, favorite: true },
            12: { rating: -1, favorite: false },
            13: { rating: null, favorite: false },
          },
          metadata: { skippedToResult: false },
        }),
      }),
    );
  });

  it("returns no ID when the backend rejects a finish event", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response("backend error", { status: 400 })),
    );
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const id = await EventsAPI.createEvent({
      electionId: 4,
      eventType: "voto_finished",
      ratings: {},
      metadata: { skippedToResult: false },
    });

    expect(id).toBe("");
    expect(errorSpy).toHaveBeenCalled();
  });

  it("sends a started event without expecting a vote ID", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response(null, { status: 201 }));
    vi.stubGlobal("fetch", fetchMock);

    expect(
      await EventsAPI.createEvent({ electionId: 4, eventType: "voto_started" }),
    ).toBe("");
    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual({
      electionId: 4,
      eventType: "voto_started",
    });
  });
});

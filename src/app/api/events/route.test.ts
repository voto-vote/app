import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/server", () => ({
  connection: vi.fn().mockResolvedValue(undefined),
}));

import { POST } from "./route";

const originalEndpoint = process.env.DATA_SHARING_ENDPOINT;

beforeEach(() => {
  process.env.DATA_SHARING_ENDPOINT = "https://backend.example";
});

afterEach(() => {
  if (originalEndpoint === undefined) {
    delete process.env.DATA_SHARING_ENDPOINT;
  } else {
    process.env.DATA_SHARING_ENDPOINT = originalEndpoint;
  }
  vi.unstubAllGlobals();
});

describe("POST /api/events", () => {
  it("forwards the backend status and body", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response("backend error", { status: 400 }));
    vi.stubGlobal("fetch", fetchMock);

    const response = await POST(
      new Request("http://localhost/api/events", {
        method: "POST",
        body: '{"eventType":"voto_started","electionId":4}',
      }),
    );

    expect(response.status).toBe(400);
    expect(await response.text()).toBe("backend error");
    expect(fetchMock).toHaveBeenCalledWith(
      "https://backend.example/events",
      expect.objectContaining({
        method: "POST",
        body: '{"eventType":"voto_started","electionId":4}',
      }),
    );
  });

  it("reports an unset backend endpoint as an error", async () => {
    delete process.env.DATA_SHARING_ENDPOINT;
    const response = await POST(
      new Request("http://localhost/api/events", {
        method: "POST",
      }),
    );

    expect(response.status).toBeGreaterThanOrEqual(500);
  });
});

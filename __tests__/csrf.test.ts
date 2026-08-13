import { NextRequest } from "next/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { rejectCrossOriginMutation } from "@/lib/csrf";

function mutation(headers: HeadersInit = {}): NextRequest {
  return new NextRequest("https://yz.example/api/wall", {
    method: "POST",
    headers,
  });
}

const invalidSources: HeadersInit[] = [
  {},
  { origin: "https://evil.example" },
  { referer: "https://evil.example/form" },
  { origin: "https://yz.example", "sec-fetch-site": "cross-site" },
];

describe("cross-origin mutation protection", () => {
  it("accepts same-origin browser requests", () => {
    expect(
      rejectCrossOriginMutation(
        mutation({ origin: "https://yz.example", "sec-fetch-site": "same-origin" })
      )
    ).toBeNull();
  });

  it("accepts a same-origin referer when Origin is absent", () => {
    expect(
      rejectCrossOriginMutation(
        mutation({ referer: "https://yz.example/recruit", "sec-fetch-site": "same-origin" })
      )
    ).toBeNull();
  });

  it("uses the forwarded public host behind a reverse proxy", () => {
    expect(
      rejectCrossOriginMutation(
        mutation({
          origin: "https://preview.example",
          host: "internal:3000",
          "x-forwarded-host": "preview.example",
          "x-forwarded-proto": "https",
        })
      )
    ).toBeNull();
  });

  it.each(invalidSources)("rejects an untrusted request source", (headers) => {
    expect(rejectCrossOriginMutation(mutation(headers))?.status).toBe(403);
  });
});

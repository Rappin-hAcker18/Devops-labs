jest.mock("next/server", () => ({
  NextResponse: {
    json: (body: unknown, init?: { status?: number }) => ({
      status: init?.status ?? 200,
      json: async () => body,
    }),
  },
}));

import { POST } from "@/app/api/contact/route";

type MockRequestPayload = Record<string, unknown> | null | undefined;

const buildRequest = (payload: MockRequestPayload) =>
  ({
    json: async () => payload,
  }) as any;

const mockFetchResponse = (status: number, body: unknown = {}) =>
  ({
    ok: status >= 200 && status < 300,
    status,
    async json() {
      return body;
    },
  }) as any;

describe("Contact API route", () => {
  const OLD_ENV = process.env;

  beforeAll(() => {
    (global as any).fetch = jest.fn();
  });

  beforeEach(() => {
    process.env = { ...OLD_ENV };
    jest.restoreAllMocks();
    (global as any).fetch = jest.fn();
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it("rejects requests missing required fields", async () => {
    const response = await POST(buildRequest({ fullName: "Tester", message: "" }) as any);

    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error).toBe("Email and message are required.");
  });

  it("forwards submissions to configured backend endpoint", async () => {
    process.env.CONTACT_API_ENDPOINT = "https://backend.example.com/contact";
    process.env.CONTACT_API_KEY = "secret";
    delete process.env.RESEND_API_KEY;
    delete process.env.SALES_TEAM_EMAIL;

    const mockFetch = jest
      .spyOn(global as any, "fetch")
      .mockResolvedValue(mockFetchResponse(200));

    const payload = {
      fullName: "Jordan",
      email: "jordan@example.com",
      message: "We want to partner.",
    };

    const response = await POST(buildRequest(payload) as any);

    expect(response.status).toBe(200);
    expect(mockFetch).toHaveBeenCalledWith(
      process.env.CONTACT_API_ENDPOINT,
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          "Content-Type": "application/json",
          "x-api-key": "secret",
        }),
        body: JSON.stringify(payload),
      })
    );
  });

  it("surfaces backend failures when forwarding submissions", async () => {
    process.env.CONTACT_API_ENDPOINT = "https://backend.example.com/contact";
    delete process.env.RESEND_API_KEY;

    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    jest
      .spyOn(global as any, "fetch")
      .mockResolvedValue(mockFetchResponse(502, { error: "Backend down" }));

    const response = await POST(
      buildRequest({
        fullName: "Jordan",
        email: "jordan@example.com",
        message: "We want to partner.",
      }) as any
    );

    expect(response.status).toBe(500);
    const body = await response.json();
    expect(body.error).toBe("Unable to process your request right now.");

    errorSpy.mockRestore();
  });

  it("falls back to Resend email delivery when configured", async () => {
    delete process.env.CONTACT_API_ENDPOINT;
    process.env.RESEND_API_KEY = "re_test";
    process.env.SALES_TEAM_EMAIL = "sales@cloudcrew.academy";
    process.env.SALES_FROM_EMAIL = "CloudCrew Sales <sales@cloudcrew.academy>";

    const mockFetch = jest
      .spyOn(global as any, "fetch")
      .mockResolvedValue(mockFetchResponse(200));

    const payload = {
      fullName: "Jordan",
      email: "jordan@example.com",
      company: "Urban Tech",
      teamSize: "10-49",
      interestedPlan: "Premium",
      timeline: "ASAP",
      message: "Need details.",
    };

    const response = await POST(buildRequest(payload) as any);

    expect(response.status).toBe(200);
    expect(mockFetch).toHaveBeenCalledWith(
      "https://api.resend.com/emails",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        }),
      })
    );

    const [, options] = mockFetch.mock.calls[0];
    const parsedBody = JSON.parse((options as RequestInit).body as string);
    expect(parsedBody.from).toBe(process.env.SALES_FROM_EMAIL);
    expect(parsedBody.to).toEqual(["sales@cloudcrew.academy"]);
    expect(parsedBody.reply_to).toBe(payload.email);
  });

  it("flags missing delivery configuration", async () => {
    delete process.env.CONTACT_API_ENDPOINT;
    delete process.env.RESEND_API_KEY;
    delete process.env.SALES_TEAM_EMAIL;

    const warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});
    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    const response = await POST(
      buildRequest({
        fullName: "Jordan",
        email: "jordan@example.com",
        message: "We want to partner.",
      }) as any
    );

    warnSpy.mockRestore();
    errorSpy.mockRestore();

    expect(response.status).toBe(500);
    const body = await response.json();
    expect(body.error).toBe(
      "Unable to process your request right now."
    );
  });
});

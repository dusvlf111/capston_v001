import { describe, it, expect, beforeEach, vi } from "vitest";

const nextResponseNext = vi.fn();
const nextResponseRedirect = vi.fn();
const mockCreateSupabaseMiddlewareClient = vi.fn();

vi.mock("next/server", () => ({
  NextResponse: {
    next: (...args: unknown[]) => nextResponseNext(...args),
    redirect: (...args: unknown[]) => nextResponseRedirect(...args),
  },
}));

vi.mock("@/lib/supabase/middleware", () => ({
  createSupabaseMiddlewareClient: mockCreateSupabaseMiddlewareClient,
}));

const middlewareModulePromise = import("../../middleware");

const createResponse = () => ({ cookies: { set: vi.fn() } });

const createRequest = (pathname: string) => {
  const url = new URL(`http://localhost${pathname}`);
  return {
    nextUrl: url,
    url: url.toString(),
  };
};

describe("middleware auth guard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("redirects unauthenticated protected requests to login", async () => {
    const authGetUser = vi.fn().mockResolvedValue({ data: { user: null }, error: null });
    const supabaseStub = { auth: { getUser: authGetUser } };

    nextResponseNext.mockReturnValue(createResponse());
    nextResponseRedirect.mockImplementation((url: URL) => ({ redirectedTo: url }));
    mockCreateSupabaseMiddlewareClient.mockImplementation((_req, res) => ({
      supabase: supabaseStub,
      response: res,
    }));

    const { middleware } = await middlewareModulePromise;
    const result = await middleware(createRequest("/report") as any);

    expect(authGetUser).toHaveBeenCalledTimes(1);
    expect(nextResponseRedirect).toHaveBeenCalledTimes(1);
    const redirectUrl = nextResponseRedirect.mock.calls[0][0] as URL;
    expect(redirectUrl.pathname).toBe("/login");
    expect(redirectUrl.searchParams.get("redirectTo")).toBe("/report");
    expect(result).toEqual({ redirectedTo: redirectUrl });
  });

  it("redirects authenticated users away from the login page", async () => {
    const authGetUser = vi.fn().mockResolvedValue({
      data: { user: { id: "user-1" } },
      error: null,
    });
    const supabaseStub = { auth: { getUser: authGetUser } };

    const response = createResponse();
    nextResponseNext.mockReturnValue(response);
    nextResponseRedirect.mockImplementation((url: URL) => ({ redirectedTo: url }));

    mockCreateSupabaseMiddlewareClient.mockImplementation((_req, res) => ({
      supabase: supabaseStub,
      response: res,
    }));

    const { middleware } = await middlewareModulePromise;
    const result = await middleware(createRequest("/login") as any);

    expect(authGetUser).toHaveBeenCalled();
    expect(nextResponseRedirect).toHaveBeenCalledTimes(1);
    const redirectUrl = nextResponseRedirect.mock.calls[0][0] as URL;
    expect(redirectUrl.pathname).toBe("/dashboard");
    expect(result).toEqual({ redirectedTo: redirectUrl });
  });

  it("allows authenticated access to protected routes", async () => {
    const authGetUser = vi.fn().mockResolvedValue({
      data: { user: { id: "user-1" } },
      error: null,
    });
    const supabaseStub = { auth: { getUser: authGetUser } };

    const response = createResponse();
    nextResponseNext.mockReturnValue(response);
    nextResponseRedirect.mockImplementation((url: URL) => ({ redirectedTo: url }));

    mockCreateSupabaseMiddlewareClient.mockImplementation((_req, res) => ({
      supabase: supabaseStub,
      response: res,
    }));

    const { middleware } = await middlewareModulePromise;
    const result = await middleware(createRequest("/report") as any);

    expect(authGetUser).toHaveBeenCalled();
    expect(nextResponseRedirect).not.toHaveBeenCalled();
    expect(result).toBe(response);
  });
});

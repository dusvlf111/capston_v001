import { renderHook, waitFor } from "@testing-library/react";
import type { User } from "@supabase/supabase-js";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { useAuth, type ProfileRow } from "./useAuth";

interface SupabaseStub {
  auth: {
    getUser: ReturnType<typeof vi.fn>;
  };
  from: ReturnType<typeof vi.fn>;
  __mock: {
    maybeSingle: ReturnType<typeof vi.fn>;
  };
}

const supabaseClientRef: { current: SupabaseStub } = {
  current: createSupabaseStub(),
};

vi.mock("@/lib/supabase/client", () => ({
  createBrowserSupabaseClient: () => supabaseClientRef.current,
}));

function createSupabaseStub(): SupabaseStub {
  const maybeSingle = vi.fn();
  const eq = vi.fn().mockReturnValue({ maybeSingle });
  const select = vi.fn().mockReturnValue({ eq });
  const from = vi.fn().mockReturnValue({ select });

  return {
    auth: {
      getUser: vi.fn(),
    },
    from,
    __mock: { maybeSingle },
  };
}

const baseUser = {
  id: "user-1",
  email: "sailor@example.com",
} as User;

describe("useAuth", () => {
  beforeEach(() => {
    supabaseClientRef.current = createSupabaseStub();
  });

  it("loads authenticated user and profile when available", async () => {
    const supabase = supabaseClientRef.current;
    supabase.auth.getUser.mockResolvedValue({
      data: { user: baseUser },
      error: null,
    });
    const profile: ProfileRow = {
      id: "profile-1",
      user_id: "user-1",
      full_name: "Captain",
      phone: "010-0000-0000",
      emergency_contact: "010-1111-1111",
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z",
    };
    supabase.__mock.maybeSingle.mockResolvedValue({ data: profile, error: null });

    const { result } = renderHook(() => useAuth());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.user).toEqual(baseUser);
    expect(result.current.profile).toEqual(profile);
    expect(result.current.error).toBeNull();
  });

  it("surfaces auth errors and clears state", async () => {
    const supabase = supabaseClientRef.current;
    supabase.auth.getUser.mockResolvedValue({
      data: { user: null },
      error: { message: "token expired" } as any,
    });

    const { result } = renderHook(() => useAuth());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.user).toBeNull();
    expect(result.current.profile).toBeNull();
    expect(result.current.error).toBe("token expired");
  });

  it("handles signed-out state without querying profiles", async () => {
    const supabase = supabaseClientRef.current;
    supabase.auth.getUser.mockResolvedValue({
      data: { user: null },
      error: null,
    });

    const { result } = renderHook(() => useAuth());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(supabase.__mock.maybeSingle).not.toHaveBeenCalled();
    expect(result.current.user).toBeNull();
    expect(result.current.profile).toBeNull();
    expect(result.current.error).toBeNull();
  });
});

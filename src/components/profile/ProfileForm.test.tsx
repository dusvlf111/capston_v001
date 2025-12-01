import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import ProfileForm from "./ProfileForm";

// Mock Supabase client
const mockUpdate = vi.fn();
const mockEq = vi.fn();
const mockFrom = vi.fn();

vi.mock("@/lib/supabase/client", () => ({
    createBrowserSupabaseClient: () => ({
        from: mockFrom,
    }),
}));

describe("ProfileForm", () => {
    const initialValues = {
        fullName: "Test User",
        phone: "010-1234-5678",
        emergencyContact: "010-9876-5432",
    };

    const props = {
        profileId: "profile-123",
        userId: "user-123",
        initialValues,
    };

    beforeEach(() => {
        vi.clearAllMocks();

        // Setup Supabase mock chain
        mockEq.mockReset();
        mockEq
            .mockReturnValueOnce({ eq: mockEq }) // First call returns object with eq
            .mockReturnValueOnce({ error: null }); // Second call returns result

        mockFrom.mockReturnValue({
            update: mockUpdate.mockReturnValue({
                eq: mockEq,
            }),
        });
    });

    it("renders with initial values", () => {
        render(<ProfileForm {...props} />);

        expect(screen.getByLabelText("이름")).toHaveValue(initialValues.fullName);
        expect(screen.getByLabelText("연락처")).toHaveValue(initialValues.phone);
        expect(screen.getByLabelText("비상 연락처")).toHaveValue(initialValues.emergencyContact);
    });

    it.skip("shows validation error for invalid phone number", async () => {
        const user = userEvent.setup();
        render(<ProfileForm {...props} />);

        const phoneInput = screen.getByLabelText("연락처");
        await user.clear(phoneInput);
        await user.type(phoneInput, "123");

        expect(phoneInput).toHaveValue("123");

        await user.click(document.body); // Blur by clicking outside

        await waitFor(() => {
            expect(screen.getByText(/010-0000-0000/)).toBeInTheDocument();
        });
    });

    it("submits form with valid data", async () => {
        const user = userEvent.setup();
        render(<ProfileForm {...props} />);

        const submitButton = screen.getByRole("button", { name: "변경 내용 저장" });

        // Simulate user input to make form dirty
        const nameInput = screen.getByLabelText("이름");
        await user.clear(nameInput);
        await user.type(nameInput, "Updated Name");

        await user.click(submitButton);

        await waitFor(() => {
            expect(mockFrom).toHaveBeenCalledWith("profiles");
            expect(mockUpdate).toHaveBeenCalledWith(expect.objectContaining({
                full_name: "Updated Name",
                phone: initialValues.phone,
                emergency_contact: initialValues.emergencyContact,
            }));
        });

        expect(screen.getByText("저장 완료")).toBeInTheDocument();
    });

    it("handles server error", async () => {
        const user = userEvent.setup();
        // Use a fresh mock for this test to avoid state leakage
        const mockEqError = vi.fn();
        let callCount = 0;
        mockEqError.mockImplementation(() => {
            callCount++;
            if (callCount === 1) {
                return { eq: mockEqError };
            }
            return { error: { message: "Server error occurred" } };
        });

        // Re-configure mockUpdate to return this new mock
        mockUpdate.mockReturnValue({ eq: mockEqError });

        render(<ProfileForm {...props} />);

        const nameInput = screen.getByLabelText("이름");
        await user.clear(nameInput);
        await user.type(nameInput, "Updated Name");

        const submitButton = screen.getByRole("button", { name: "변경 내용 저장" });
        await user.click(submitButton);

        await waitFor(() => {
            expect(mockEqError).toHaveBeenCalled();
        });

        await waitFor(() => {
            expect(screen.getByText("저장 실패")).toBeInTheDocument();
            expect(screen.getByText("Server error occurred")).toBeInTheDocument();
        });
    });
});

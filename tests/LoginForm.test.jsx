import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router";
import LoginForm from "../src/components/LoginForm";
import * as router from "react-router";

const mockLogin = vi.fn();
const mockNavigate = vi.fn();

vi.mock("react-router", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    MemoryRouter: actual.MemoryRouter, // Ensure MemoryRouter is included
  };
});

describe("LoginForm component", () => {
  it("renders the login form", () => {
    render(
      <MemoryRouter initialEntries={["/login"]}>
        <Routes>
          <Route path="/login" element={<LoginForm />} />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText("Login")).toBeInTheDocument();
    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Log In" })).toBeInTheDocument();
  });

  it("updates the form data", () => {
    render(
      <MemoryRouter initialEntries={["/login"]}>
        <Routes>
          <Route path="/login" element={<LoginForm />} />
        </Routes>
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "test@email.com" },
    });

    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "test" },
    });

    expect(screen.getByLabelText("Email").value).toBe("test@email.com");
    expect(screen.getByLabelText("Password").value).toBe("test");
  });

  it("handles form submission and navigation on success", async () => {
    mockLogin.mockResolvedValue({
      success: true,
      user: {
        email: "user@email.com",
        first_name: "Test",
        id: 2,
        last_name: "User",
        num_surveys: 5,
      },
    });
    const { findByRole } = render(
      <MemoryRouter initialEntries={["/login"]}>
        <Routes>
          <Route
            path="/login"
            element={<LoginForm login={mockLogin} isLoading={false} />}
          />
        </Routes>
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "test@email.com" },
    });

    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "test" },
    });

    fireEvent.click(await findByRole("button", { name: "Log In" }));
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: "test@email.com",
        password: "test",
      });
      expect(mockNavigate).toHaveBeenCalledWith("/survey/2/all");
    });
  });

  it("handles form submission and shows error on failure", async () => {
    mockLogin.mockResolvedValue({
      success: false,
    });
    const { findByRole } = render(
      <MemoryRouter initialEntries={["/login"]}>
        <Routes>
          <Route
            path="/login"
            element={<LoginForm login={mockLogin} isLoading={false} />}
          />
        </Routes>
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "test@email.com" },
    });

    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "test" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Log In" }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: "test@email.com",
        password: "test",
      });
      expect(
        screen.getByText("Email and password did not match")
      ).toBeInTheDocument();
      expect(screen.getByLabelText("Email").value).toBe("test@email.com");
    });
  });
});

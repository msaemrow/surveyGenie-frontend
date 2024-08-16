import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router";
import SignUpForm from "../src/components/SignUpForm";

describe("SignUpForm component", () => {
  it("renders the sign up form", () => {
    render(
      <MemoryRouter initialEntries={["/signup"]}>
        <Routes>
          <Route path="/signup" element={<SignUpForm />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByText("First Name")).toBeInTheDocument();
    expect(screen.getByText("Last Name")).toBeInTheDocument();
    expect(screen.getByText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sign Up" })).toBeInTheDocument();
  });

  it("updates the form data", () => {
    render(
      <MemoryRouter initialEntries={["/signup"]}>
        <Routes>
          <Route path="/signup" element={<SignUpForm />} />
        </Routes>
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "test@email.com" },
    });
    fireEvent.change(screen.getByLabelText("First Name"), {
      target: { value: "John" },
    });
    fireEvent.change(screen.getByLabelText("Last Name"), {
      target: { value: "Smith" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "test" },
    });

    expect(screen.getByLabelText("Email").value).toBe("test@email.com");
    expect(screen.getByLabelText("First Name").value).toBe("John");
    expect(screen.getByLabelText("Last Name").value).toBe("Smith");
    expect(screen.getByLabelText("Password").value).toBe("test");
  });
});

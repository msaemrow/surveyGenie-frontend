import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router";
import UpdateProfileForm from "../src/components/UpdateProfileForm";
import UserContext from "../src/components/UserContext";

const mockUser = {
  email: "test@test.com",
  first_name: "John",
  last_name: "Doe",
};

describe("UpdateProfileForm component", () => {
  const currentUser = {
    id: 1,
    first_name: "John",
    last_name: "Doe",
    email: "test@test.com",
    num_surveys: 2,
  };

  it("renders the Update profile form correctly", () => {
    render(
      <MemoryRouter initialEntries={["/user-profile"]}>
        <UserContext.Provider value={{ currentUser }}>
          <Routes>
            <Route path="/user-profile" element={<UpdateProfileForm />} />
          </Routes>
        </UserContext.Provider>
      </MemoryRouter>
    );
    expect(screen.getByText("Email:")).toBeInTheDocument();
    expect(screen.getByText("First Name:")).toBeInTheDocument();
    expect(screen.getByText("Last Name:")).toBeInTheDocument();
    expect(screen.getByText("Password:")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Save Changes" })
    ).toBeInTheDocument();
  });

  it("updates the form inputs correctly", () => {
    render(
      <MemoryRouter initialEntries={["/user-profile"]}>
        <UserContext.Provider value={{ currentUser }}>
          <Routes>
            <Route path="/user-profile" element={<UpdateProfileForm />} />
          </Routes>
        </UserContext.Provider>
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText("Email:"), {
      target: { value: "test@test.com" },
    });
    fireEvent.change(screen.getByLabelText("First Name:"), {
      target: { value: "Bob" },
    });
    fireEvent.change(screen.getByLabelText("Last Name:"), {
      target: { value: "Smith" },
    });
    fireEvent.change(screen.getByLabelText("Password:"), {
      target: { value: "test" },
    });

    expect(screen.getByLabelText("Email:").value).toBe("test@test.com");
    expect(screen.getByLabelText("First Name:").value).toBe("Bob");
    expect(screen.getByLabelText("Last Name:").value).toBe("Smith");
    expect(screen.getByLabelText("Password:").value).toBe("test");
  });
});

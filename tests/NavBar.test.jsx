import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import NavBar from "../src/components/NavBar";
import { MemoryRouter } from "react-router";
import UserContext from "../src/components/UserContext";

const mockLogout = vi.fn();

describe("NavBar Component", () => {
  it("renders the NavBar for logged-in users", () => {
    const currentUser = { id: 1, first_name: "John" };

    render(
      <MemoryRouter>
        <UserContext.Provider value={{ currentUser, logout: mockLogout }}>
          <NavBar />
        </UserContext.Provider>
      </MemoryRouter>
    );

    // Check if logged-in links are present
    expect(screen.getByText(/Create Survey/i)).toBeInTheDocument();
    expect(screen.getByText(/View Surveys/i)).toBeInTheDocument();
    expect(screen.getByText(/Profile/i)).toBeInTheDocument();
    expect(screen.getByText(/Logout \(John\)/i)).toBeInTheDocument();
  });

  it("renders the NavBar for logged-out users", () => {
    render(
      <MemoryRouter>
        <UserContext.Provider value={{ currentUser: null, logout: mockLogout }}>
          <NavBar />
        </UserContext.Provider>
      </MemoryRouter>
    );

    // Check if logged-out links are present
    expect(screen.getByText(/Home/i)).toBeInTheDocument();
    expect(screen.getByText(/Login/i)).toBeInTheDocument();
    expect(screen.getByText(/Sign Up/i)).toBeInTheDocument();
  });
  it("calls logout function when Logout link is clicked", () => {
    const spy = vi.spyOn({ mockLogout }, "mockLogout");
    const currentUser = { id: 1, first_name: "John" };

    render(
      <MemoryRouter>
        <UserContext.Provider value={{ currentUser, logout: mockLogout }}>
          <NavBar logout={mockLogout} />
        </UserContext.Provider>
      </MemoryRouter>
    );

    const logoutLink = screen.getByText(/Logout \(John\)/i);
    fireEvent.click(logoutLink);

    expect(mockLogout).toHaveBeenCalled();
  });
});

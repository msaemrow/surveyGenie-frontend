import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes, Navigate } from "react-router-dom";
import AppRoutes from "../src/components/AppRoutes";
import Homepage from "../src/components/Homepage";
import SurveyPublic from "../src/components/SurveyPublic";
import LoginForm from "../src/components/LoginForm";
import SignUpForm from "../src/components/SignUpForm";
import UpdateProfileForm from "../src/components/UpdateProfileForm";
import ProtectedRoute from "../src/components/ProtectedRoute";
import UserContext from "../src/components/UserContext";

const MockProtectedRoute = ({ children }) => {
  const isAuthenticated = true; // Mock authentication status
  return isAuthenticated ? children : <Navigate to="/login" />;
};

describe("AppRoutes component", () => {
  it("renders the homepage for the root path", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <AppRoutes />
      </MemoryRouter>
    );
    expect(screen.getByText("SurveyGenie")).toBeInTheDocument();
  });

  it("renders the public survey page for the public survey path", () => {
    render(
      <MemoryRouter initialEntries={["/public/survey/1/101"]}>
        <AppRoutes />
      </MemoryRouter>
    );
    expect(screen.getByText("Loading Survey...")).toBeInTheDocument(); // Update based on actual text/content
  });

  it("renders the login page for the login path", () => {
    render(
      <MemoryRouter initialEntries={["/login"]}>
        <AppRoutes />
      </MemoryRouter>
    );
    expect(screen.getByText("Login")).toBeInTheDocument(); // Update based on actual text/content
  });

  it("renders the signup page for the signup path", () => {
    render(
      <MemoryRouter initialEntries={["/signup"]}>
        <AppRoutes />
      </MemoryRouter>
    );
    expect(screen.getByText("Sign Up")).toBeInTheDocument(); // Update based on actual text/content
  });

  it("renders the update profile form for the user-profile path when user is authenticated", () => {
    const authenticatedUser = {
      email: "test@test.com",
      first_name: "Test",
      last_name: "User",
    };

    render(
      <MemoryRouter initialEntries={["/user-profile"]}>
        <UserContext.Provider value={{ currentUser: authenticatedUser }}>
          <AppRoutes />
        </UserContext.Provider>
      </MemoryRouter>
    );
    expect(screen.getByText("Update Profile")).toBeInTheDocument();
  });
  it("redirects to the homepage for an unknown path", () => {
    render(
      <MemoryRouter initialEntries={["/randomRoute"]}>
        <AppRoutes />
      </MemoryRouter>
    );
    expect(screen.getByText("SurveyGenie")).toBeInTheDocument();
  });
});

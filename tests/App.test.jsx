import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, it, expect, vi } from "vitest";
import App from "../src/components/App";
import SurveyGenieApi from "../src/api/api";
import UserContext from "../src/components/UserContext";

vi.mock("./SurveyGenieApi", () => ({
  setCurrentUser: vi.fn(),
  login: vi.fn(),
  getCurrentUser: vi.fn(),
}));

describe("App component", () => {
  it("renders NavBar and HomePage of the AppRoutes component", async () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    // Verify the NavBar and heading
    expect(screen.getByRole("navigation")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 1, name: "SurveyGenie" })
    ).toBeInTheDocument();
  });
});

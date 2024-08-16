import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import ResponseSummary from "../src/components/ResponseSummary";
import SurveyGenieApi from "../src/api/api";
import UserContext from "../src/components/UserContext";
import { expect, vi } from "vitest";

// Mock the SurveyGenieApi
vi.mock("../src/api/api");

const currentUser = {
  id: 1,
  first_name: "John",
  last_name: "Doe",
  email: "test@test.com",
  num_surveys: 2,
};

const mockSurvey = {
  id: 1,
  title: "Test Survey",
  survey_description: "This is a test survey",
};

const mockChartData = [
  {
    name: "Question 1",
    answers: [
      { name: "Option A", value: 2 },
      { name: "Option B", value: 3 },
    ],
  },
];

const mockTableData = [
  {
    "Response ID": 1,
    Timestamp: "01/01/24 12:00",
    "Question 1": "Option A",
  },
];

describe("ResponseSummary Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    SurveyGenieApi.getResponseData.mockResolvedValue([
      {
        question_text: "Question 1",
        answer_text: "Option A",
        response_id: 1,
        timestamp: "2024-01-01T12:00:00Z",
      },
    ]);
    SurveyGenieApi.getSurvey.mockResolvedValue(mockSurvey);
  });

  it("renders without crashing", async () => {
    render(
      <MemoryRouter initialEntries={["/survey/1/1/summary"]}>
        <UserContext.Provider value={{ currentUser }}>
          <Routes>
            <Route
              path="/survey/:user_id/:survey_id/summary"
              element={<ResponseSummary />}
            />
          </Routes>
        </UserContext.Provider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Survey 1 Response Summary")).toBeInTheDocument();
    });
  });

  it("displays survey title, description, chart, and table", async () => {
    render(
      <MemoryRouter initialEntries={["/survey/1/1/summary"]}>
        <UserContext.Provider value={{ currentUser }}>
          <Routes>
            <Route
              path="/survey/:user_id/:survey_id/summary"
              element={<ResponseSummary />}
            />
          </Routes>
        </UserContext.Provider>
      </MemoryRouter>
    );
    screen.debug();
    await waitFor(() => {
      // Check if survey title and description are rendered

      expect(screen.getByText("Title: Test Survey")).toBeInTheDocument();
      expect(
        screen.getByText("Survey Description: This is a test survey")
      ).toBeInTheDocument();
    });
  });
});

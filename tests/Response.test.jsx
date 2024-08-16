import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { expect, vi } from "vitest";
import Response from "../src/components/Response";
import SurveyGenieApi from "../src/api/api";

// Mock the SurveyGenieApi
vi.mock("../src/api/api");

const mockResponse = {
  answers: [
    { id: 1, question_text: "Question 1", answer_text: "Answer A" },
    { id: 2, question_text: "Question 2", answer_text: "Answer B" },
  ],
};

describe("Response Component", () => {
  beforeEach(() => {
    // Reset the mock implementation before each test
    vi.clearAllMocks();
  });

  it("renders loading state initially", () => {
    // Mock the API call to simulate a delay
    SurveyGenieApi.getSingleResponse.mockImplementation(
      () =>
        new Promise((resolve) => setTimeout(() => resolve(mockResponse), 1000))
    );

    render(<Response response_id={1} completed_at="2024-08-19T12:00:00Z" />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders response data after fetching", async () => {
    // Mock the API response
    SurveyGenieApi.getSingleResponse.mockResolvedValue(mockResponse);

    render(<Response response_id={1} completed_at="2024-08-19T12:00:00Z" />);

    // Wait for the response data to be rendered
    await waitFor(() => {
      expect(screen.getByText("Response id: 1")).toBeInTheDocument();
      expect(
        screen.getByText("Completed at: 2024-08-19T12:00:00Z")
      ).toBeInTheDocument();
      expect(screen.getByText("Question Responses")).toBeInTheDocument();
      expect(screen.getByText("Question 1: Answer A")).toBeInTheDocument();
      expect(screen.getByText("Question 2: Answer B")).toBeInTheDocument();
    });
  });

  it("handles API errors gracefully", async () => {
    // Mock the API to throw an error
    SurveyGenieApi.getSingleResponse.mockRejectedValue(new Error("API error"));

    render(<Response response_id={1} completed_at="2024-08-19T12:00:00Z" />);

    // Wait for loading state to be replaced by error handling or a fallback
    await waitFor(() => {
      expect(screen.getByText("Loading...")).toBeInTheDocument();
      // Optionally, you can add more checks if there's specific error handling in place
    });
  });
});

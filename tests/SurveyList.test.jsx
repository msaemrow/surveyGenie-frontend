import { describe, it, expect } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router";
import UserContext from "../src/components/UserContext";
import Unauthorized from "../src/components/Unauthorized";
import SurveyList from "../src/components/SurveyList";
import SurveyGenieApi from "../src/api/api";

describe("SurveyList component", () => {
  const mockSurveys = [
    { id: 1, title: "Survey 1" },
    { id: 2, title: "Survey 2" },
  ];

  const mockGetSurveys = vi
    .spyOn(SurveyGenieApi, "getAllSurveys")
    .mockResolvedValue(() => mockSurveys);

  const mockDeleteSurvey = vi
    .spyOn(SurveyGenieApi, "deleteSurvey")
    .mockResolvedValue(() => mockSurveys);

  it("renders the list of all surveys", async () => {
    const currentUser = { id: 1, first_name: "John", num_surveys: 2 };
    render(
      <MemoryRouter initialEntries={["/survey/1/all"]}>
        <UserContext.Provider value={{ currentUser }}>
          <Routes>
            <Route path="/survey/:user_id/all" element={<SurveyList />} />
          </Routes>
        </UserContext.Provider>
      </MemoryRouter>
    );
    expect(screen.getByText("All Surveys")).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText("Survey 1")).toBeInTheDocument();
      expect(screen.getByText("Survey 2")).toBeInTheDocument();
    });
  });

  it("renders Unauthorized when 401 error occurs", async () => {
    const currentUser = { id: 1, first_name: "John", num_surveys: 2 };
    SurveyGenieApi.getAllSurveys.mockRejectedValue({
      response: { status: 401 },
    });

    render(
      <MemoryRouter initialEntries={["/survey/1/all"]}>
        <UserContext.Provider value={{ currentUser }}>
          <Routes>
            <Route path="/survey/:user_id/all" element={<SurveyList />} />
          </Routes>
        </UserContext.Provider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByText("You are not authorized to view other users' surveys.")
      ).toBeInTheDocument();
    });
  });

  it("renders 'No Surveys Found' message when no surveys are returned", async () => {
    const currentUser = { id: 1, first_name: "John", num_surveys: 2 };
    SurveyGenieApi.getAllSurveys.mockResolvedValue([]);

    render(
      <MemoryRouter initialEntries={["/survey/1/all"]}>
        <UserContext.Provider value={{ currentUser }}>
          <Routes>
            <Route path="/survey/:user_id/all" element={<SurveyList />} />
          </Routes>
        </UserContext.Provider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByText("No Surveys Found! Time to create one!")
      ).toBeInTheDocument();
    });
  });

  it("deletes a survey when the delete button is clicked", async () => {
    const currentUser = { id: 1, first_name: "John", num_surveys: 2 };
    const initialSurveys = [
      { id: 1, title: "Survey 1" },
      { id: 2, title: "Survey 2" },
    ];
    const remainingSurveys = [{ id: 2, title: "Survey 2" }];

    SurveyGenieApi.getAllSurveys
      .mockResolvedValueOnce(initialSurveys)
      .mockResolvedValueOnce(remainingSurveys);
    SurveyGenieApi.deleteSurvey.mockResolvedValue({});

    render(
      <MemoryRouter initialEntries={["/survey/1/all"]}>
        <UserContext.Provider value={{ currentUser }}>
          <Routes>
            <Route path="/survey/:user_id/all" element={<SurveyList />} />
          </Routes>
        </UserContext.Provider>
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getByText("Survey 1")).toBeInTheDocument();
      expect(screen.getByText("Survey 2")).toBeInTheDocument();
    });

    fireEvent.click(screen.getAllByText("X")[0]);

    await waitFor(() => {
      expect(SurveyGenieApi.deleteSurvey).toHaveBeenCalledWith("1", 1);
      expect(screen.queryByText("Survey 1")).not.toBeInTheDocument();
    });
  });
});

import { describe, it, expect, vi } from "vitest";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import Survey from "../src/components/Survey";
import { QuestionType } from "../src/enums";
import UserContext from "../src/components/UserContext";
import SurveyGenieApi from "../src/api/api";

const mockSurveyData = {
  id: 1,
  title: "Test",
  survey_description: "This is a test",
  questions: [
    {
      id: 123,
      text: "What is your age?",
      type: QuestionType.MULTIPLE,
      options: [
        { id: 1, text: "<20" },
        { id: 2, text: "20-30" },
        { id: 5, text: ">30" },
      ],
    },
    {
      id: 124,
      text: "What is your favorite color?",
      type: QuestionType.TEXT,
      options: [],
    },
    {
      id: 125,
      text: "Are you scared of the dark?",
      type: QuestionType.YN,
      options: [],
    },
  ],
};

vi.spyOn(SurveyGenieApi, "getSurvey").mockResolvedValue(mockSurveyData);

describe("Survey Component", () => {
  const currentUser = { id: 1, first_name: "John", num_surveys: 2 };

  it("renders the survey title and description", async () => {
    await act(async () => {
      render(
        <MemoryRouter initialEntries={["/survey/1/1"]}>
          <UserContext.Provider value={{ currentUser }}>
            <Routes>
              <Route path="/survey/:user_id/:survey_id" element={<Survey />} />
            </Routes>
          </UserContext.Provider>
        </MemoryRouter>
      );
    });

    await waitFor(() => {
      expect(screen.getByText("Test")).toBeInTheDocument();
      expect(screen.getByText("This is a test")).toBeInTheDocument();
      expect(screen.getByText("What is your age?")).toBeInTheDocument();
      expect(
        screen.getByText("What is your favorite color?")
      ).toBeInTheDocument();
      expect(
        screen.getByText("Are you scared of the dark?")
      ).toBeInTheDocument();
      expect(screen.queryByText("Are you hungry?")).not.toBeInTheDocument();
    });
  });

  it("updates the choices when answered", async () => {
    await act(async () => {
      render(
        <MemoryRouter initialEntries={["/survey/1/1"]}>
          <UserContext.Provider value={{ currentUser }}>
            <Routes>
              <Route path="/survey/:user_id/:survey_id" element={<Survey />} />
            </Routes>
          </UserContext.Provider>
        </MemoryRouter>
      );
    });
    fireEvent.click(screen.getByLabelText("20-30"), {
      target: { value: "20-30" },
    });
    fireEvent.change(screen.getByTestId("input-question-124"), {
      target: { value: "blue" },
    });
    fireEvent.click(screen.getByLabelText("Yes"));

    expect(screen.getByLabelText("20-30").value).toBe("20-30");
    expect(screen.getByTestId("input-question-124").value).toBe("blue");
    expect(screen.getByLabelText("Yes").value).toBe("yes");
  });

  // it("submits the survey", () => {
  //   const consoleSpy = vi.spyOn(console, "log");

  //   render(
  //     <MemoryRouter initialEntries={["/survey/1"]}>
  //       <UserContext.Provider value={{ currentUser }}>
  //         <Routes>
  //           <Route path="/survey/:surveyId" element={<Survey />} />
  //         </Routes>
  //       </UserContext.Provider>
  //     </MemoryRouter>
  //   );
  //   fireEvent.click(screen.getByLabelText("30 or under"), {
  //     target: { value: "30 or under" },
  //   });
  //   fireEvent.change(screen.getByLabelText("What is your favorite color?"), {
  //     target: { value: "Blue" },
  //   });
  //   fireEvent.click(screen.getByLabelText("Yes"));

  //   fireEvent.submit(screen.getByRole("button", { name: /Submit Survey/i }));

  //   expect(console.log).toHaveBeenCalledWith(
  //     "Survey Responses",
  //     expect.objectContaining({
  //       123: "30 or under",
  //       124: "Blue",
  //       125: "yes",
  //     })
  //   );
  // });
});

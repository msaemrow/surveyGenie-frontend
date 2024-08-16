import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import NewSurveyForm from "../src/components/NewSurveyForm";
import { QuestionType } from "../src/enums";
import SurveyGenieApi from "../src/api/api";
import UserContext from "../src/components/UserContext";

describe("NewSurveyForm component", () => {
  const currentUser = { id: 1, first_name: "John", num_surveys: 2 };

  it("renders the new survey form", () => {
    render(
      <MemoryRouter initialEntries={["/survey-new"]}>
        <UserContext.Provider value={{ currentUser }}>
          <Routes>
            <Route path="/survey-new" element={<NewSurveyForm />} />
          </Routes>
        </UserContext.Provider>
      </MemoryRouter>
    );
    expect(screen.getByText("Create Your Survey")).toBeInTheDocument();
    expect(screen.getByLabelText("Survey Title")).toBeInTheDocument();
    expect(screen.getByLabelText("Survey Description")).toBeInTheDocument();
    expect(screen.getAllByRole("button").length).toBe(4);
  });

  it("adds a new TEXT question", () => {
    render(
      <MemoryRouter initialEntries={["/survey-new"]}>
        <UserContext.Provider value={{ currentUser }}>
          <Routes>
            <Route path="/survey-new" element={<NewSurveyForm />} />
          </Routes>
        </UserContext.Provider>
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText(`Add ${QuestionType.TEXT} Question`));

    expect(
      screen.getByText(
        "New Text Question (Blank text input will be response option)"
      )
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Remove Question" })
    ).toBeInTheDocument();
  });

  it("adds a new MULITPLE CHOICE question", () => {
    render(
      <MemoryRouter initialEntries={["/survey-new"]}>
        <UserContext.Provider value={{ currentUser }}>
          <Routes>
            <Route path="/survey-new" element={<NewSurveyForm />} />
          </Routes>
        </UserContext.Provider>
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText(`Add ${QuestionType.MULTIPLE} Question`));

    expect(
      screen.getByText(
        "New Multiple Choice Question (Can only select one option)"
      )
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Remove Question" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Add Choice" })
    ).toBeInTheDocument();
  });

  it("adds a new YES OR NO question", () => {
    render(
      <MemoryRouter initialEntries={["/survey-new"]}>
        <UserContext.Provider value={{ currentUser }}>
          <Routes>
            <Route path="/survey-new" element={<NewSurveyForm />} />
          </Routes>
        </UserContext.Provider>
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText(`Add ${QuestionType.YN} Question`));

    expect(
      screen.getByText(
        "New Yes Or No Question (Only responses will be yes or no)"
      )
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Remove Question" })
    ).toBeInTheDocument();
  });

  it("updates input properly for TEXT question", () => {
    render(
      <MemoryRouter initialEntries={["/survey-new"]}>
        <UserContext.Provider value={{ currentUser }}>
          <Routes>
            <Route path="/survey-new" element={<NewSurveyForm />} />
          </Routes>
        </UserContext.Provider>
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText(`Add ${QuestionType.TEXT} Question`));
    fireEvent.change(screen.getByLabelText("Question Text"), {
      target: { value: "Text Question" },
    });
    expect(screen.getByLabelText("Question Text").value).toBe("Text Question");
  });

  it("updates input properly for MULTIPLE CHOICE question", () => {
    render(
      <MemoryRouter initialEntries={["/survey-new"]}>
        <UserContext.Provider value={{ currentUser }}>
          <Routes>
            <Route path="/survey-new" element={<NewSurveyForm />} />
          </Routes>
        </UserContext.Provider>
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText(`Add ${QuestionType.MULTIPLE} Question`));
    fireEvent.change(screen.getByLabelText("Question Text"), {
      target: { value: "Multiple Choice Question" },
    });
    expect(screen.getByLabelText("Question Text").value).toBe(
      "Multiple Choice Question"
    );
  });

  it("updates input properly for YES OR NO question", () => {
    render(
      <MemoryRouter initialEntries={["/survey-new"]}>
        <UserContext.Provider value={{ currentUser }}>
          <Routes>
            <Route path="/survey-new" element={<NewSurveyForm />} />
          </Routes>
        </UserContext.Provider>
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText(`Add ${QuestionType.YN} Question`));
    fireEvent.change(screen.getByLabelText("Question Text"), {
      target: { value: "Yes or No Question" },
    });
    expect(screen.getByLabelText("Question Text").value).toBe(
      "Yes or No Question"
    );
  });

  it("adds a single option to a multiple choice question", () => {
    render(
      <MemoryRouter initialEntries={["/survey-new"]}>
        <UserContext.Provider value={{ currentUser }}>
          <Routes>
            <Route path="/survey-new" element={<NewSurveyForm />} />
          </Routes>
        </UserContext.Provider>
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText(`Add ${QuestionType.MULTIPLE} Question`));
    fireEvent.click(screen.getByText("Add Choice"));

    expect(screen.getByText("Choice")).toBeInTheDocument();
  });

  it("adds multiple options to a multiple choice question", () => {
    render(
      <MemoryRouter initialEntries={["/survey-new"]}>
        <UserContext.Provider value={{ currentUser }}>
          <Routes>
            <Route path="/survey-new" element={<NewSurveyForm />} />
          </Routes>
        </UserContext.Provider>
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText(`Add ${QuestionType.MULTIPLE} Question`));
    fireEvent.click(screen.getByText("Add Choice"));
    fireEvent.click(screen.getByText("Add Choice"));
    fireEvent.click(screen.getByText("Add Choice"));
    fireEvent.click(screen.getByText("Add Choice"));

    expect(screen.getAllByText("Choice").length).toBe(4);
  });

  it("submits the form properly after adding a text, multiple choice and yes/no question", async () => {
    const consoleSpy = vi.spyOn(console, "log");
    const mockCreateSurvey = vi.fn().mockResolvedValue({ success: true });
    SurveyGenieApi.createSurvey = mockCreateSurvey;
    render(
      <MemoryRouter initialEntries={["/survey-new"]}>
        <UserContext.Provider value={{ currentUser }}>
          <Routes>
            <Route path="/survey-new" element={<NewSurveyForm />} />
          </Routes>
        </UserContext.Provider>
      </MemoryRouter>
    );

    await act(async () => {
      fireEvent.click(screen.getByText(`Add ${QuestionType.TEXT} Question`));
      fireEvent.click(
        screen.getByText(`Add ${QuestionType.MULTIPLE} Question`)
      );
      fireEvent.click(screen.getByText(`Add ${QuestionType.YN} Question`));
    });

    const textInput = screen.getByLabelText(/Question Text/i, {
      selector: "#text-question",
    });
    fireEvent.change(textInput, { target: { value: "Text question" } });

    const multipleChoiceInput = screen.getByLabelText(/Question Text/i, {
      selector: "#multiple-question",
    });
    fireEvent.change(multipleChoiceInput, {
      target: { value: "Multiple choice question" },
    });

    const yesNoInput = screen.getByLabelText(/Question Text/i, {
      selector: "#yes-no-question",
    });
    fireEvent.change(yesNoInput, { target: { value: "Yes or no question" } });

    await act(async () => {
      fireEvent.click(screen.getByText("Create Survey"));
    });

    expect(mockCreateSurvey).toHaveBeenCalledWith(currentUser.id, {
      title: "",
      survey_description: "",
      questions: expect.arrayContaining([
        expect.objectContaining({
          question_text: "Text question",
          question_type: QuestionType.TEXT,
          options: [],
        }),
        expect.objectContaining({
          question_text: "Multiple choice question",
          question_type: QuestionType.MULTIPLE,
          options: [],
        }),
        expect.objectContaining({
          question_text: "Yes or no question",
          question_type: QuestionType.YN,
          options: [],
        }),
      ]),
    });
  });
});

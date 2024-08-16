import { describe, expect, it } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Choice from "../src/components/Choice";
import { QuestionType } from "../src/enums";

describe("Choice Component", () => {
  const mockOnResponseChange = vi.fn();

  it("renders text input for TEXT question type", () => {
    render(
      <Choice
        ofType={QuestionType.TEXT}
        onResponseChange={mockOnResponseChange}
      />
    );

    const textInput = screen.getByRole("textbox");
    expect(textInput).toBeInTheDocument();

    fireEvent.change(textInput, { target: { value: "Test" } });
    expect(mockOnResponseChange).toHaveBeenCalledWith("Test");
  });

  it("renders radio buttons for MULTIPLE CHOICE question type", () => {
    const choices = [
      { id: 1, question_id: 1, text: "Choice 1" },
      { id: 2, question_id: 1, text: "Choice 2" },
      { id: 3, question_id: 1, text: "Choice 3" },
    ];
    render(
      <Choice
        ofType={QuestionType.MULTIPLE}
        choices={choices}
        onResponseChange={mockOnResponseChange}
      />
    );

    const radioButtons = screen.getAllByRole("radio");
    expect(radioButtons).toHaveLength(3);

    fireEvent.click(radioButtons[0]);
    expect(mockOnResponseChange).toHaveBeenCalledWith("Choice 1");

    fireEvent.click(radioButtons[1]);
    expect(mockOnResponseChange).toHaveBeenCalledWith("Choice 2");
  });

  it("renders radio buttons for YES OR NO question type", () => {
    render(
      <Choice
        ofType={QuestionType.YN}
        onResponseChange={mockOnResponseChange}
      />
    );

    const yesRadioButton = screen.getByLabelText("Yes");
    const noRadioButton = screen.getByLabelText("No");

    expect(yesRadioButton).toBeInTheDocument();
    expect(noRadioButton).toBeInTheDocument();

    fireEvent.click(yesRadioButton);
    expect(mockOnResponseChange).toHaveBeenCalledWith("yes");

    fireEvent.click(noRadioButton);
    expect(mockOnResponseChange).toHaveBeenCalledWith("no");
  });
});

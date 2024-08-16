import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Question from "../src/components/Question";
import { QuestionType } from "../src/enums";

describe("Question Component", () => {
  const mockOnResponseChange = vi.fn();
  const defaultProps = {
    id: 123,
    text: "This is the default question",
    type: QuestionType.MULTIPLE,
    choices: [
      { id: "1", text: "Option 1" },
      { id: "2", text: "Option 2" },
      { id: "3", text: "Option 3" },
      { id: "4", text: "Option 4" },
    ],
    onResponseChange: mockOnResponseChange,
  };

  it("renders a Question", () => {
    // const currentUser = { id: 1, first_name: "John", num_surveys: 2 };
    render(<Question {...defaultProps} />);

    const questionText = screen.getByText("This is the default question");
    expect(questionText).toBeInTheDocument();
  });

  it("renders the Choice copmonent with the correct props", () => {
    render(<Question {...defaultProps} />);

    const choices = screen.getAllByRole("radio");
    expect(choices).toHaveLength(4);
  });

  it("calls onResponseChange with the correct arguments when a choice is selected", () => {
    render(<Question {...defaultProps} />);

    const choiceRadio = screen.getByLabelText("Option 1");
    fireEvent.click(choiceRadio);

    expect(mockOnResponseChange).toHaveBeenCalledWith(123, "Option 1");
  });
});

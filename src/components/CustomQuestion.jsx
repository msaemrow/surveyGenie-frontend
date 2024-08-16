import React, { useState } from "react";
import { QuestionType } from "../enums";
import Option from "./Option";
import "../css/CustomQuestion.css";

const CustomQuestion = ({
  question_type,
  id,
  options,
  onRemoveQuestion,
  onQuestionChange,
  onOptionsChange,
  onAddOption,
  onRemoveOption,
}) => {
  const [questionText, setQuestionText] = useState("");

  const handleOptionChange = (choice_id, choice_text) => {
    const updatedOptions = options.map((option) =>
      option.choice_id === choice_id ? { ...option, choice_text } : option
    );
    onOptionsChange(id, updatedOptions);
  };

  const handleQuestionChange = (e) => {
    setQuestionText(e.target.value);
    onQuestionChange(id, e.target.value);
  };

  const handleRemoveOption = (choice_id) => {
    console.log("CHOICE ID", choice_id);
    console.log("QUESTION ID", id);
    onRemoveOption(choice_id);
  };

  const renderOptions = () => {
    return options.map((option) => (
      <div key={option.choice_id} className="CustomQuestion-option-container">
        <Option
          key={option.choice_id}
          option={option}
          onOptionChange={handleOptionChange}
        />
        <button
          type="button"
          className="CustomQuestion-button button-remove-option"
          onClick={() => handleRemoveOption(option.choice_id)}
        >
          Remove Option
        </button>
      </div>
    ));
  };

  const renderQuestionInput = () => {
    switch (question_type) {
      case QuestionType.TEXT:
        return (
          <div className="CustomQuestion-question-box">
            <h5 className="CustomQuestion-question-box-title">
              New Text Question (Blank text input will be response option)
              <span>
                <button
                  type="button"
                  className="CustomQuestion-button button-remove"
                  onClick={onRemoveQuestion}
                >
                  Remove Question
                </button>
              </span>
            </h5>
            <div className="CustionQuestion-question">
              <label className="CustomQuestion-label" htmlFor="text-question">
                Question Text
              </label>
              <input
                type="text"
                id="text-question"
                value={questionText}
                onChange={handleQuestionChange}
              />
            </div>
          </div>
        );
      case QuestionType.MULTIPLE:
        return (
          <div className="CustomQuestion-question-box">
            <h5 className="CustomQuestion-question-box-title">
              New Multiple Choice Question (Can only select one option)
              <span>
                <button
                  type="button"
                  className="CustomQuestion-button button-remove"
                  onClick={onRemoveQuestion}
                >
                  Remove Question
                </button>
              </span>
            </h5>
            <div className="CustomQuestion-question">
              <label
                className="CustomQuestion-label"
                htmlFor="multiple-question"
              >
                Question Text
              </label>
              <input
                type="text"
                id="multiple-question"
                value={questionText}
                onChange={handleQuestionChange}
              />
            </div>
            <div className="CustomQuestion-option-list">{renderOptions()}</div>
            <button
              type="button"
              className="CustomQuestion-button button-add"
              onClick={onAddOption}
            >
              Add Choice
            </button>
          </div>
        );
      case QuestionType.YN:
        return (
          <div className="CustomQuestion-question-box">
            <h5 className="CustomQuestion-question-box-title">
              New Yes Or No Question (Only responses will be yes or no)
              <span>
                <button
                  type="button"
                  className="CustomQuestion-button button-remove"
                  onClick={onRemoveQuestion}
                >
                  Remove Question
                </button>
              </span>
            </h5>
            <div className="CustomQuestion-question">
              <label className="CustomQuestion-label" htmlFor="yes-no-question">
                Question Text
              </label>
              <input
                type="text"
                id="yes-no-question"
                value={questionText}
                onChange={handleQuestionChange}
              />
            </div>
          </div>
        );
      default:
        return <p>Question type not found</p>;
    }
  };

  return renderQuestionInput();
};

export default CustomQuestion;

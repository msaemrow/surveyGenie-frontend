import React, { useState } from "react";
import { QuestionType } from "../enums";
import "../css/Choice.css";

const Choice = ({ ofType, choices = [], onResponseChange, question_id }) => {
  const [selectedChoice, setSelectedChoice] = useState(null);

  const handleChoiceChange = (choiceText) => {
    setSelectedChoice(choiceText);
    onResponseChange(choiceText);
  };
  const TextQuestionChoice = (
    <input
      data-testid={`input-question-${question_id}`}
      className="Choice-text-response"
      type="text"
      id={`Choice-text input-question-${question_id}`}
      onChange={(e) => onResponseChange(e.target.value)}
      required
    />
  );

  const MultipleChoiceQuestionChoice = (
    <div className="Choices-radio-buttons-all">
      {choices.map((choice) => (
        <div className="Choice-radio-button" key={choice.id}>
          <input
            className="Choice-radio-button-input"
            type="radio"
            id={`choice-${choice.id}`}
            name={`choices-${choice.question_id}`}
            value={choice.text}
            onChange={() => handleChoiceChange(choice.text)}
            required
          />
          <label className="Choice-label" htmlFor={`choice-${choice.id}`}>
            {choice.text}
          </label>
        </div>
      ))}
    </div>
  );
  const YesOrNoQuestionChoice = (
    <div className="Choices-radio-buttons-all Choice-yes-or-no">
      <div className="Choice-radio-button">
        <input
          className="Choice-radio-button-input"
          id="choice-yes"
          type="radio"
          name="choice"
          value="yes"
          onChange={() => onResponseChange("yes")}
          required
        />
        <label htmlFor="choice-yes" className="Choice-label">
          Yes
        </label>
      </div>
      <div className="Choice-radio-button">
        <input
          className="Choice-radio-button-input"
          type="radio"
          id="choice-no"
          name="choice"
          value="no"
          onChange={() => onResponseChange("no")}
          required
        />
        <label className="Choice-label" htmlFor="choice-no">
          No
        </label>
      </div>
    </div>
  );

  let renderChoice;

  switch (ofType) {
    case QuestionType.TEXT:
      renderChoice = TextQuestionChoice;
      break;
    case QuestionType.MULTIPLE:
      renderChoice = MultipleChoiceQuestionChoice;
      break;
    case QuestionType.YN:
      renderChoice = YesOrNoQuestionChoice;
      break;
    default:
      renderChoice = <p>No choices found for the this question</p>;
  }

  return renderChoice;
};

export default Choice;

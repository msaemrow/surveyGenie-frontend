import React from "react";
import "../css/Question.css";
import Choice from "./Choice";

const Question = ({ id, text, type, onResponseChange, choices }) => {
  const handleResponseChange = (response) => {
    onResponseChange(id, response);
  };
  return (
    <div className="Question">
      <p id={`Question-${id}`} className="Question-text">
        {text}
      </p>
      <Choice
        ofType={type}
        choices={choices.map((choice) => ({ ...choice, question_id: id }))}
        onResponseChange={handleResponseChange}
        question_id={id}
      />
    </div>
  );
};

export default Question;

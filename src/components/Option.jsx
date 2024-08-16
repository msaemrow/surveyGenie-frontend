import React from "react";
import "../css/Option.css";

const Option = ({ option, onOptionChange }) => {
  const handleChange = (e) => {
    onOptionChange(option.choice_id, e.target.value);
  };
  return (
    <div className="CustomQuestion-option">
      <label className="CustomQuestion-option-text">Choice</label>
      <input type="text" value={option.choice_text} onChange={handleChange} />
    </div>
  );
};

export default Option;

import React from "react";
import "../css/SurveyCompletionPage.css";

const SurveyCompletionPage = () => {
  return (
    <div className="survey-completion-container">
      <h1 className="survey-completion-title">Survey Completed!</h1>
      <p className="survey-completion-message">
        Thank you for completing the survey. Your responses have been submitted
        successfully.
      </p>
    </div>
  );
};

export default SurveyCompletionPage;

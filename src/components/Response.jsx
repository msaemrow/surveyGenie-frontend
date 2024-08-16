import React, { useEffect, useState } from "react";
import SurveyGenieApi from "../api/api";
import "../css/Response.css";

const Response = ({ response_id, completed_at }) => {
  const [response, setResponse] = useState(null);

  useEffect(() => {
    getSingleResponse();
  }, [response_id]);

  async function getSingleResponse() {
    try {
      let res = await SurveyGenieApi.getSingleResponse(response_id);
      setResponse(res);
    } catch (err) {
      console.error("Error: ", err);
    }
  }

  if (!response) return <div>Loading...</div>;

  return (
    <div className="Response-container">
      <p className="Response-id">Response id: {response_id}</p>
      <p className="Response-completed">Completed at: {completed_at}</p>
      <p className="Response-question-title">Question Responses</p>
      {response.answers.map((answer) => (
        <p key={answer.id} className="Response-question-answer">
          {answer.question_text}: {answer.answer_text}
        </p>
      ))}
    </div>
  );
};

export default Response;

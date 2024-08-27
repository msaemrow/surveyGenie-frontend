import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import SurveyGenieApi from "../api/api";
import "../css/Survey.css";
import Question from "./Question";

const SurveyPublic = () => {
  const navigate = useNavigate();
  const { user_id, survey_id } = useParams();

  const [survey, setSurvey] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [pageError, setPageError] = useState(false);
  const [responses, setResponses] = useState({});

  useEffect(() => {
    const getSingleSurvey = async () => {
      try {
        let surveyRes = await SurveyGenieApi.getSurvey(user_id, survey_id);
        setSurvey(surveyRes);
        setPageLoading(false);
      } catch (err) {
        setPageError(true);
        setPageLoading(false);
      }
    };

    getSingleSurvey();
  }, [user_id, survey_id]);

  const handleResponseChange = (questionId, response) => {
    setResponses((prevResponses) => ({
      ...prevResponses,
      [questionId]: response,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const survey_id_int = parseInt(survey_id);
    const surveyResponse = {
      survey_id: survey_id_int,
      responses: responses,
    };
    await SurveyGenieApi.completeSurvey(surveyResponse);
    navigate(`/public/survey/${user_id}/${survey_id}/completed`);
  };

  if (pageLoading) return <div>Loading Survey...</div>;
  if (pageError)
    return (
      <div>
        <h1>Could not find that survey</h1>
      </div>
    );

  return (
    <div className="Survey">
      <h1 className="Survey-title">{survey.title}</h1>
      <p className="Survey-description">{survey.survey_description}</p>
      <div className="Survey-questions-box">
        <form className="Survey-submission-form" onSubmit={handleSubmit}>
          {survey.questions.map((question) => (
            <Question
              key={question.id}
              id={question.id}
              text={question.text}
              type={question.type}
              onResponseChange={handleResponseChange}
              choices={question.options}
            />
          ))}
          <button className="Survey-button btn-submit" type="submit">
            Submit Survey
          </button>
        </form>
      </div>
    </div>
  );
};

export default SurveyPublic;

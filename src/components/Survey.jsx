import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { useParams, useNavigate } from "react-router";
import SurveyGenieApi from "../api/api";
import "../css/Survey.css";
import Question from "./Question";
import UserContext from "./UserContext";
import Loading from "./Loading";

const Survey = () => {
  const { user_id, survey_id } = useParams();
  const { currentUser } = useContext(UserContext);
  const navigate = useNavigate();

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

  const handleSubmit = (e) => {
    e.preventDefault();
    const surveyResponse = {
      survey_id: id,
      reponses: responses,
    };
    // Need to add logic to acutally submit responses to the database
  };

  if (pageLoading) return <Loading />;
  if (pageError)
    return (
      <div>
        <h1>Could not find that survey</h1>
      </div>
    );

  return (
    <div className="Survey">
      <h1 className="Survey-title">
        {survey.title}{" "}
        <span>
          <button
            type="button"
            onClick={() =>
              navigate(`/survey/${currentUser.id}/${survey_id}/summary`)
            }
            className="Survey-results-btn"
          >
            View Results
          </button>
        </span>
      </h1>
      <p className="Survey-description">{survey.survey_description}</p>
      <p>
        Link to public version of the survey:{" "}
        <Link
          className="Survey-link"
          to={`/public/survey/${user_id}/${survey_id}`}
        >
          Survey {survey_id}
        </Link>
      </p>
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
          <button className="Survey-button btn-edit" type="button">
            Edit Survey - in development
          </button>
        </form>
      </div>
    </div>
  );
};

export default Survey;

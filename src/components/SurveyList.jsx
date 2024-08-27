import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router";
import UserContext from "./UserContext";
import SurveyGenieApi from "../api/api";
import { Link } from "react-router-dom";
import "../css/SurveyList.css";
import Unauthorized from "./Unauthorized";
import Loading from "./Loading";

const SurveyList = () => {
  const { user_id } = useParams();
  const { currentUser } = useContext(UserContext);
  const navigate = useNavigate();

  const [surveys, setSurveys] = useState([]);
  const [error, setError] = useState("");
  const [pageLoading, setPageLoading] = useState(true);
  const [deleteMsg, setDeleteMsg] = useState("");

  useEffect(() => {
    findSurveys();
  }, [user_id]);

  async function findSurveys() {
    try {
      let surveyRes = await SurveyGenieApi.getAllSurveys(user_id);
      setSurveys(surveyRes);
      setError("");
      setPageLoading(false);
    } catch (err) {
      setPageLoading(false);
      const status = err.response ? err.response.status : 500;
      const message =
        err.response?.data?.error?.message || "An unknown error occurred";
      if (status === 401) {
        setError("Unauthorized");
      } else {
        setError("An error occurred while fetching surveys.");
      }
    }
  }

  async function handleClickDelete(survey_id) {
    const confirmation = window.confirm(
      "Are you sure you want to delete this survey?"
    );
    if (confirmation) {
      await SurveyGenieApi.deleteSurvey(user_id, survey_id);
      findSurveys();
    }
  }

  function handleClickCreateSurvey(e) {
    e.preventDefault();
    navigate(`/survey-new`);
  }

  if (error === "Unauthorized") {
    return <Unauthorized />;
  }

  if (pageLoading) return <Loading />;

  if (surveys.length === 0)
    return (
      <div className="SurveyList-div-no-surveys">
        <h1 className="SurveyList-no-surveys">
          No Surveys Found! Time to create one!
        </h1>
        <button
          type="button"
          onClick={handleClickCreateSurvey}
          className="SurveyList-create-survey-btn"
        >
          Create survey!
        </button>
      </div>
    );

  return (
    <div>
      <h1 className="SurveyList-title">All Surveys </h1>
      <h4 className="SurveyList-subtitle">
        Number of surveys created: {currentUser.num_surveys}
      </h4>
      {deleteMsg && <p className="SurveyList-delete-msg">{deleteMsg}</p>}
      {surveys.length === 0 ? (
        <h3>No Surveys Found! Time to create one!</h3>
      ) : (
        <div className="SurveyList-container">
          {surveys.map((survey) => (
            <div className="SurveyList-link-container" key={survey.id}>
              <h4 className="SurveyList-title-link">
                <Link
                  className="Survey-link"
                  to={`/survey/${user_id}/${survey.id}`}
                >
                  {survey.title}
                </Link>

                <span>
                  <Link
                    className="Survey-results-link"
                    to={`/survey/${user_id}/${survey.id}/summary`}
                  >
                    {"  "} (View Results)
                  </Link>
                </span>
                <button
                  type="button"
                  className="SurveyList-delete-survey btn"
                  onClick={() => handleClickDelete(survey.id)}
                >
                  {" "}
                  X
                </button>
              </h4>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SurveyList;

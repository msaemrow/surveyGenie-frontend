import React, { useContext, useEffect, useState } from "react";
import SurveyGenieApi from "../api/api";
import SimpleBarChart from "./SimpleBarChart";
import { useParams, useNavigate } from "react-router";
import UserContext from "./UserContext";
import Loading from "./Loading";
import "../css/ResponseSummary.css";

function formatTimestamp(timestamp) {
  const date = new Date(timestamp);

  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const year = date.getFullYear().toString().slice(-2);
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${month}/${day}/${year} ${hours}:${minutes}`;
}

const ResponseSummary = () => {
  const { survey_id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useContext(UserContext);

  const [chartData, setChartData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [tableHeaders, setTableHeaders] = useState([]);
  const [survey, setSurvey] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    findResponseData();
    getSurveyInfo();
  }, [survey_id]);

  async function findResponseData() {
    let res = await SurveyGenieApi.getResponseData(survey_id);
    if (res.length !== 0) {
      const { chartData, tableData, headers } = transformChartData(res);
      setChartData(chartData);
      setTableData(tableData);
      setTableHeaders(headers);
    }
    setPageLoading(false);
  }

  async function getSurveyInfo() {
    let surveyRes = await SurveyGenieApi.getSurvey(currentUser.id, survey_id);
    setSurvey(surveyRes);
  }

  function transformChartData(chartDataArr) {
    // Group answers by question and response
    const groupedData = chartDataArr.reduce((acc, curr) => {
      const { question_text, answer_text, response_id, timestamp } = curr;

      // Find or create an entry for this question
      let questionEntry = acc.find((item) => item.name === question_text);
      if (!questionEntry) {
        questionEntry = { name: question_text, responses: [] };
        acc.push(questionEntry);
      }

      // Add the response to this question entry
      questionEntry.responses.push({
        answer: answer_text,
        response_id,
        timestamp,
      });

      return acc;
    }, []);

    // Generate chart data
    const chartData = groupedData.map((question) => {
      const answerCounts = question.responses.reduce((acc, { answer }) => {
        acc[answer] = (acc[answer] || 0) + 1;
        return acc;
      }, {});

      return {
        name: question.name,
        answers: Object.keys(answerCounts).map((answer) => ({
          name: answer,
          value: answerCounts[answer],
        })),
      };
    });
    // Generate table headers and dataa
    const headers = [
      "Response ID",
      "Timestamp",
      ...groupedData.map((q) => q.name),
    ];
    const tableData = groupedData.reduce((acc, question) => {
      question.responses.forEach((r) => {
        let row = acc.find((row) => row["Response ID"] === r.response_id);
        if (!row) {
          row = {
            "Response ID": r.response_id,
            Timestamp: formatTimestamp(r.timestamp),
          };
          acc.push(row);
        }
        row[question.name] = r.answer;
      });
      return acc;
    }, []);
    return { chartData, tableData, headers };
  }

  function returnToSurveyList() {
    if (currentUser && currentUser.id) {
      navigate(`/survey/${currentUser.id}/all`);
    } else {
      console.error("No current user or user ID found.");
    }
  }

  if (pageLoading) return <Loading />;

  if (tableData.length === 0 && chartData.length === 0) {
    return (
      <div>
        <h1 className="ResponseSummary-subtitle">
          No data found for this survey!
        </h1>
        <button
          type="button"
          className="ResponseSummary-return-button"
          onClick={returnToSurveyList}
        >
          Return to list
        </button>
      </div>
    );
  }

  return (
    <div className="ResponseSummary-container">
      <h1 className="ResponseSummary-title">
        Survey {survey_id} Response Summary
      </h1>
      <h2 className="ResponseSummary-survey-title">Title: {survey.title}</h2>
      <h4 className="ResponseSummary-survey-description">
        Survey Description: {survey.survey_description}
      </h4>
      <button
        type="button"
        onClick={() => navigate(`/survey/${currentUser.id}/${survey_id}`)}
      >
        View Survey
      </button>
      <div className="ResponseSummary-charts">
        {chartData.map((data) => (
          <div key={data.name} className="ResponseSummary-chart-container">
            <h2 className="ResponseSummary-chart-title">{data.name}</h2>
            <SimpleBarChart data={data.answers} />
          </div>
        ))}
      </div>
      <div className="ResponseSummary-table">
        <h2 className="ResponseSummary-table-title">Response Summary Table</h2>
        <table>
          <thead>
            <tr>
              {tableHeaders.map((header, index) => (
                <th key={index}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {tableHeaders.map((header, colIndex) => (
                  <td key={colIndex}>{row[header] || ""}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResponseSummary;

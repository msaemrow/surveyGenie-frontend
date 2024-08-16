import React, { useState, useContext } from "react";
import { useNavigate } from "react-router";
import { v4 as uuidv4 } from "uuid";
import { QuestionType } from "../enums";
import CustomQuestion from "./CustomQuestion";
import UserContext from "./UserContext";
import SurveyGenieApi from "../api/api";
import "../css/NewSurveyForm.css";
/**
 * NewSurveyForm component for creating new custom surveys.
 * @param
 * @returns {JSX.Element} Survey component
 */

const NewSurveyForm = () => {
  const navigate = useNavigate();
  const { currentUser } = useContext(UserContext);

  let initialState = {
    title: "",
    survey_description: "",
    questions: [],
  };

  const [formData, setFormData] = useState(initialState);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((data) => ({ ...data, [name]: value }));
  };

  const handleAddQuestion = (question_type) => {
    setFormData((data) => ({
      ...data,
      questions: [
        ...data.questions,
        {
          question_id: uuidv4(),
          question_type,
          question_text: "",
          options: [],
        },
      ],
    }));
  };

  const handleRemoveQuestion = (id) => {
    setFormData((data) => ({
      ...data,
      questions: data.questions.filter(
        (question) => question.question_id !== id
      ),
    }));
  };

  const handleQuestionChange = (id, question_text) => {
    setFormData((data) => ({
      ...data,
      questions: data.questions.map((question) =>
        question.question_id === id ? { ...question, question_text } : question
      ),
    }));
  };

  const handleAddOption = (question_id) => {
    const newOption = { choice_id: uuidv4(), choice_text: "" };

    setFormData((data) => ({
      ...data,
      questions: data.questions.map((question) =>
        question.question_id === question_id
          ? {
              ...question,
              options: [...question.options, newOption],
            }
          : question
      ),
    }));
  };

  const handleRemoveOption = (question_id, option_choice_id) => {
    const updatedQuestions = formData.questions.map((question) =>
      question.question_id === question_id
        ? {
            ...question,
            options: question.options.filter(
              (option) => option.choice_id !== option_choice_id
            ),
          }
        : question
    );
    setFormData((data) => ({
      ...data,
      questions: updatedQuestions,
    }));
  };

  const handleOptionsChange = (question_id, updatedOptions) => {
    setFormData((data) => ({
      ...data,
      questions: data.questions.map((question) =>
        question.question_id === question_id
          ? { ...question, options: updatedOptions }
          : question
      ),
    }));
  };

  const handleSubmit = async (e) => {
    let res = await SurveyGenieApi.createSurvey(currentUser.id, formData);

    navigate(`/survey/${currentUser.id}/all`);
  };

  return (
    <div className="NewSurveyForm">
      <h1>Create Your Survey</h1>
      <form className="NewSurveyForm-Form">
        <div className="NewSurveyForm-data">
          <label className="NewSurveyForm-label" htmlFor="title">
            Survey Title
          </label>
          <input
            type="text"
            name="title"
            id="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="NewSurveyForm-data">
          <label className="NewSurveyForm-label" htmlFor="survey_description">
            Survey Description
          </label>
          <input
            type="text"
            name="survey_description"
            id="survey_description"
            value={formData.survey_description}
            onChange={handleChange}
            required
          />
        </div>
        <div className="NewSurveyForm-questions">
          {formData.questions.length === 0 ? (
            <h4 className="NewSurveyForm-questions-message">
              Click the buttons below to begin adding questions
            </h4>
          ) : (
            formData.questions.map((question) => (
              <CustomQuestion
                key={question.question_id}
                question_type={question.question_type}
                id={question.question_id}
                options={question.options}
                onRemoveQuestion={() =>
                  handleRemoveQuestion(question.question_id)
                }
                onQuestionChange={handleQuestionChange}
                onOptionsChange={handleOptionsChange}
                onAddOption={() => handleAddOption(question.question_id)}
                onRemoveOption={(option_choice_id) =>
                  handleRemoveOption(question.question_id, option_choice_id)
                }
              />
            ))
          )}
        </div>
        <button
          className="NewSurveyForm-btn btn-add"
          type="button"
          onClick={() => handleAddQuestion(QuestionType.TEXT)}
        >{`Add ${QuestionType.TEXT} Question`}</button>
        <button
          className="NewSurveyForm-btn btn-add"
          type="button"
          onClick={() => handleAddQuestion(QuestionType.MULTIPLE)}
        >{`Add ${QuestionType.MULTIPLE} Question`}</button>
        <button
          className="NewSurveyForm-btn btn-add"
          type="button"
          onClick={() => handleAddQuestion(QuestionType.YN)}
        >{`Add ${QuestionType.YN} Question`}</button>
        <br />
        <button className="NewSurveyForm-btn btn-create" onClick={handleSubmit}>
          Create Survey
        </button>
      </form>
    </div>
  );
};

export default NewSurveyForm;

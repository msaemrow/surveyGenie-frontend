import React, { useState, useContext } from "react";
import { useNavigate } from "react-router";
import UserContext from "./UserContext";
import "../css/UpdateProfileForm.css";
import SurveyGenieApi from "../api/api";

const UpdateProfileForm = () => {
  const { currentUser } = useContext(UserContext);

  let initialState = {
    email: currentUser.email || "",
    first_name: currentUser.first_name || "",
    last_name: currentUser.last_name || "",
    password: "",
  };
  const [formData, setFormData] = useState(initialState);
  const [formErrors, setFormErrors] = useState([]);
  const navigate = useNavigate();

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((data) => ({
      ...data,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    // let res = SurveyGenieApi.updateUser(currentUser.id, formData);
    // navigate("/");
  }

  return (
    <div className="UpdateProfile">
      <h1 className="UpdateProfile-title">Update Profile</h1>
      <form className="UpdateProfile-form" onSubmit={handleSubmit}>
        <div className="UpdateProfile-data">
          <label className="UpdateProfile-label" htmlFor="email">
            Email:{" "}
          </label>
          <input
            className="UpdateProfile-input"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div className="UpdateProfile-data">
          <label className="UpdateProfile-label" htmlFor="first-name">
            First Name:{" "}
          </label>
          <input
            className="UpdateProfile-input"
            name="first_name"
            id="first-name"
            value={formData.first_name}
            onChange={handleChange}
          />
        </div>
        <div className="UpdateProfile-data">
          <label className="UpdateProfile-label" htmlFor="last-name">
            Last Name:{" "}
          </label>
          <input
            className="UpdateProfile-input"
            name="last_name"
            id="last-name"
            value={formData.last_name}
            onChange={handleChange}
          />
        </div>

        <div className="UpdateProfile-data">
          <label className="UpdateProfile-label" htmlFor="password">
            Password:{" "}
          </label>
          <input
            type="password"
            className="UpdateProfile-input"
            name="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        {formErrors.length ? (
          <div>
            {formErrors.map((error) => (
              <p key={error}>{error}</p>
            ))}
          </div>
        ) : null}
        <button className="UpdateProfile-btn" type="submit">
          Save Changes- in development
        </button>
      </form>
    </div>
  );
};

export default UpdateProfileForm;

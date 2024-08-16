import React, { useState } from "react";
import { useNavigate } from "react-router";
import "../css/SignUpForm.css";

const SignUpForm = ({ signup }) => {
  const navigate = useNavigate();
  let initialState = {
    password: "",
    first_name: "",
    last_name: "",
    email: "",
    num_surveys: 0,
  };
  const [formData, setFormData] = useState(initialState);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((data) => ({ ...data, [name]: value }));
  };

  async function handleSubmit(e) {
    e.preventDefault();
    let res = await signup(formData);
    if (!res.success) {
      navigate("/survey/1/all");
    } else {
      navigate("/signup");
    }
    setFormData(initialState);
  }

  return (
    <div className="SignUpForm">
      <h1 className="SignUpForm-title">Sign Up!</h1>
      <form className="SignUpForm-form" onSubmit={handleSubmit}>
        <div className="SignUpForm-data">
          <label className="SignUpForm-label" htmlFor="email">
            Email{" "}
          </label>
          <input
            className="SignUpForm-input"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="SignUpForm-data">
          <label className="SignUpForm-label" htmlFor="first-name">
            First Name{" "}
          </label>
          <input
            className="SignUpForm-input"
            name="first_name"
            id="first-name"
            value={formData.first_name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="SignUpForm-data">
          <label className="SignUpForm-label" htmlFor="last-name">
            Last Name{" "}
          </label>
          <input
            className="SignUpForm-input"
            name="last_name"
            id="last-name"
            value={formData.last_name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="SignUpForm-data">
          <label className="SignUpForm-label" htmlFor="password">
            Password{" "}
          </label>
          <input
            type="password"
            className="SignUpForm-input"
            name="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button className="SignUpForm-btn">Sign Up</button>
      </form>
    </div>
  );
};

export default SignUpForm;

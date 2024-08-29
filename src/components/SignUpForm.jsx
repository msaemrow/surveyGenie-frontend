import React, { useState } from "react";
import { useNavigate } from "react-router";
import "../css/SignUpForm.css";

const SignUpForm = ({ signup, isLoading }) => {
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
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      setFormData((data) => ({ ...data, password: "" }));
      return;
    }
    let res = await signup(formData);
    console.log("SIGNUP: ", res);
    if (res.success && res.user) {
      while (isLoading) {
        await new Promise((resolve) => setTimeout(resolve, 50));
      }
      console.log("USER ID", res.user.id);
      navigate(`/survey/${res.user.id}/all`);
    } else {
      if (
        res.err.response.data.error.message[0] ===
        'instance.email does not conform to the "email" format'
      ) {
        setError("Please enter a valid email with the @ symbol");
      } else {
        setError(
          res.err.response.data.error.message ||
            "Error creating account. Please try again."
        );
      }
      setFormData((data) => ({ ...data, password: "" }));
    }
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
            type="email"
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

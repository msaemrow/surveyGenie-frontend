import React, { useState } from "react";
import { useNavigate } from "react-router";
import "../css/LoginForm.css";

const LoginForm = ({ login, isLoading }) => {
  const navigate = useNavigate();
  let initialSate = {
    email: "",
    password: "",
  };

  const [formData, setFormData] = useState(initialSate);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((data) => ({ ...data, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let res = await login(formData);
    if (res.success && res.user) {
      while (isLoading) {
        await new Promise((resolve) => setTimeout(resolve, 50));
      }
      navigate(`/survey/${res.user.id}/all`);
    } else {
      console.error("Login failed or user ID not found");
      setError(res.message || "Email and password did not match");
      setFormData((data) => ({ ...data, password: "" }));
    }
  };

  return (
    <div className="LoginForm">
      <h1 className="LoginForm-title"> Login</h1>
      <form className="LoginForm-form" onSubmit={handleSubmit}>
        <div className="LoginForm-data">
          <label className="LoginForm-label" htmlFor="email">
            Email
          </label>
          <input
            className="LoginForm-input"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="LoginForm-data">
          <label className="LoginForm-label" htmlFor="password">
            Password
          </label>
          <input
            type="password"
            className="LoginForm-input"
            name="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        {error && <div className="LoginForm-error">{error}</div>}
        <button className="LoginForm-btn">Log In</button>
      </form>
    </div>
  );
};

export default LoginForm;

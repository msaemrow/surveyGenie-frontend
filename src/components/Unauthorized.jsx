import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "./UserContext";
import "../css/Unauthorized.css";

const Unauthorized = () => {
  const navigate = useNavigate();
  const { currentUser } = useContext(UserContext);

  function navigateBack() {
    if (currentUser && currentUser.id) {
      navigate(`/survey/${currentUser.id}/all`);
    } else {
      console.error("No current user or user ID found.");
    }
  }

  return (
    <div className="Unauthorized">
      <h1 className="Unauthorized-title">
        You are not authorized to view other users' surveys.
      </h1>
      <p className="Unauthorized-text">
        Please return to your surveys
        <span className="Unauthorized-span-button">
          <button
            className="Unauthorized-button"
            type="button"
            onClick={navigateBack}
          >
            Return to my surveys
          </button>
        </span>
      </p>
    </div>
  );
};

export default Unauthorized;

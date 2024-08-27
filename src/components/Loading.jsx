import React from "react";
import "../css/Loading.css";

const Loading = () => {
  return (
    <div className="Loading-container">
      <div className="Loading-spinner"></div>
      <p className="Loading-text">Loading...</p>
    </div>
  );
};

export default Loading;

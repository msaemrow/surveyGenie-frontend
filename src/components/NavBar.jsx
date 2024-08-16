import React, { useContext } from "react";
import { Link } from "react-router-dom";
import UserContext from "./UserContext";
import "../css/NavBar.css";

const NavBar = ({ logout }) => {
  const { currentUser } = useContext(UserContext);

  function loggedInNavBar() {
    return (
      <ul>
        <li className="NavBar-li">
          <Link className="NavLinkItem" to="/survey-new">
            Create Survey
          </Link>
        </li>
        <li className="NavBar-li">
          <Link className="NavLinkItem" to={`/survey/${currentUser.id}/all`}>
            View Surveys
          </Link>
        </li>
        <li className="NavBar-li">
          <Link className="NavLinkItem" to="/user-profile">
            Profile
          </Link>
        </li>
        <li className="NavBar-li">
          <Link className="NavLinkItem" onClick={logout}>
            Logout ({currentUser.first_name})
          </Link>
        </li>
      </ul>
    );
  }

  function loggedOutNavBar() {
    return (
      <ul>
        <li className="NavBar-li">
          <Link className="NavLinkItem" to="/">
            Home
          </Link>
        </li>
        <li className="NavBar-li">
          <Link data-testid="login-link" className="NavLinkItem" to="/login">
            Login
          </Link>
        </li>
        <li className="NavBar-li">
          <Link className="NavLinkItem" to="/signup">
            Sign Up
          </Link>
        </li>
      </ul>
    );
  }

  return (
    <nav className="NavBar">
      <div className="NavBar-title">
        <Link className="NavBar-logo" to="/">
          SurveyGenie
        </Link>
      </div>
      <div className="NavBar-links">
        {currentUser ? loggedInNavBar() : loggedOutNavBar()}
      </div>
    </nav>
  );
};

export default NavBar;

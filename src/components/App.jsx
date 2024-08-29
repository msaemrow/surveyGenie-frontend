import React, { useEffect, useState } from "react";
import AppRoutes from "./AppRoutes";
import NavBar from "./NavBar";
import SurveyGenieApi from "../api/api";
import { jwtDecode } from "jwt-decode";
import UserContext from "./UserContext";
import useLocalStorage from "../hooks/useLocalStorage";
import "../css/App.css";
import { useNavigate } from "react-router";

export const TOKEN_KEY = "token";

function App() {
  const navigate = useNavigate();

  const [token, setToken] = useLocalStorage(TOKEN_KEY);
  const [currentUser, setCurrentUser] = useState(null);
  const [pageIsLoaded, setPageIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function getCurrentUser() {
      if (token) {
        try {
          let { user_id } = jwtDecode(token);
          SurveyGenieApi.token = token;
          let currentUser = await SurveyGenieApi.getCurrentUser(user_id);
          setCurrentUser(currentUser);
        } catch (err) {
          console.error("Error finding user: ", err);
          setCurrentUser(null);
        }
      }
      setPageIsLoaded(true);
    }
    setPageIsLoaded(false);
    getCurrentUser();
  }, [token]);

  async function signup(userData) {
    try {
      let tokenRes = await SurveyGenieApi.signup(userData);
      setToken(tokenRes);
      let { user_id } = jwtDecode(tokenRes);
      SurveyGenieApi.token = tokenRes;

      let userRes;
      try {
        userRes = await SurveyGenieApi.getCurrentUser(user_id);
        console.log("TESTING APP.JSX signup fn", userRes);
      } catch (userErr) {
        console.error("Error fetching current user:", userErr);
        setIsLoading(false);
        return {
          success: false,
          message: "Error fetching user data",
          id: user_id,
        };
      }
      console.log("USER RES OBJECT OUTSIDE TRY BLOCK", userRes);
      setCurrentUser(userRes);
      return { success: true, user: userRes };
    } catch (err) {
      console.error("Signup failed:", err);
      return { success: false, err };
    }
  }

  async function login(userData) {
    setIsLoading(true);
    try {
      let tokenRes = await SurveyGenieApi.login(userData);
      setToken(tokenRes);

      let { user_id } = jwtDecode(tokenRes);

      SurveyGenieApi.token = tokenRes;

      let userRes;
      try {
        userRes = await SurveyGenieApi.getCurrentUser(user_id);
      } catch (userErr) {
        console.error("Error fetching current user:", userErr);
        setIsLoading(false);
        return {
          success: false,
          message: "Error fetching user data",
          id: user_id,
        };
      }

      setCurrentUser(userRes);
      setIsLoading(false);
      return { success: true, user: userRes };
    } catch (err) {
      console.error("Login failed", err);
      return { succcess: false };
    }
  }

  function logout() {
    setCurrentUser(null);
    setToken(null);
    navigate("/login");
  }

  if (!pageIsLoaded) return <div>Loading... </div>;

  return (
    <div className="App">
      <UserContext.Provider value={{ currentUser, setCurrentUser, login }}>
        <NavBar logout={logout} />
        <AppRoutes signup={signup} login={login} isLoading={isLoading} />
      </UserContext.Provider>
    </div>
  );
}

export default App;

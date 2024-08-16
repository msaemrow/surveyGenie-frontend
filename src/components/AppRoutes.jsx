import { Route, Routes, Navigate } from "react-router";
import Homepage from "./Homepage";
import Survey from "./Survey";
import SurveyList from "./SurveyList";
import NewSurveyForm from "./NewSurveyForm";
import LoginForm from "./LoginForm";
import SignUpForm from "./SignUpForm";
import UpdateProfileForm from "./UpdateProfileForm";
import ProtectedRoute from "./ProtectedRoute";
import ResponseSummary from "./ResponseSummary";
import SurveyPublic from "./SurveyPublic";
import "../css/AppRoutes.css";

const AppRoutes = ({ signup, login, isLoading }) => {
  return (
    <div className="AppRoutes">
      <Routes>
        {/* Unprotected Routes */}
        <Route exact path="/" element={<Homepage />} />
        <Route
          path="/login"
          element={<LoginForm login={login} isLoading={isLoading} />}
        />
        <Route path="/signup" element={<SignUpForm signup={signup} />} />
        <Route
          path="/public/survey/:user_id/:survey_id"
          element={<SurveyPublic />}
        />

        {/* Protected Routes */}
        <Route
          path="/survey/:user_id/:survey_id"
          element={
            <ProtectedRoute>
              <Survey />
            </ProtectedRoute>
          }
        />
        <Route
          path="/survey/:user_id/all"
          element={
            <ProtectedRoute>
              <SurveyList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/survey-new"
          element={
            <ProtectedRoute>
              <NewSurveyForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user-profile"
          element={
            <ProtectedRoute>
              <UpdateProfileForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/survey/:user_id/:survey_id/summary"
          element={
            <ProtectedRoute>
              <ResponseSummary />
            </ProtectedRoute>
          }
        />

        {/* Catch all route redirects to home */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
};

export default AppRoutes;

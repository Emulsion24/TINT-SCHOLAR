import React, { useEffect } from "react";
import { Route, Routes, Navigate, Link } from "react-router-dom";
import LoginPage from "./Pages/LoginPage";
import StudentSignUp from "./Pages/StudentSignUp";
import EmailVerificationPage from "./Pages/EmailVerificationPage";
import ForgotPasswordPage from "./Pages/ForgotPasswordPage";
import LoadingSpinner from "./component/LoadingSpinner";
import AdminDashboard from "./Pages/AdminDashboard";
import ResetPasswordPage from "./Pages/ResetPasswordPage";
import { useAuthStore } from "./store/authStore";
import { Toaster } from "react-hot-toast";
import Landing from "./Pages/Landing";
import StudentCard from "./component/StudentCard";
import StudentDashboard from "./Pages/StudentDashboard";
import TeacherDashboard from "./Pages/TeacherDashboardPage";
import backgroundImage from "./assets/academic-background.jpg";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, teacher } = useAuthStore();

  // Check if authenticated
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Check if the user or teacher is verified
  const isUserVerified = user?.isVerified;
  const isTeacherVerified = teacher?.isVerified;

  if ((!user && !teacher) || (!isUserVerified && !isTeacherVerified)) {
    return <Navigate to="/verify-email" replace />;
  }

  // Check if the user's or teacher's role is allowed
  const userRole = user?.role;
  const teacherRole = teacher?.role;

  if (allowedRoles && !allowedRoles.includes(userRole || teacherRole)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const RedirectAuthenticatedUser = ({ children }) => {
  const { isAuthenticated, user, teacher } = useAuthStore();

  // Verify user or teacher roles
  const isUserVerified = user?.isVerified;
  const isTeacherVerified = teacher?.isVerified;

  if (isAuthenticated && isUserVerified && user?.role === "student") {
    return <Navigate to="/student" replace />;
  }

  if (isAuthenticated && isTeacherVerified && teacher?.role === "student") {
    return <Navigate to="/student" replace />;
  }

  if (isAuthenticated && isUserVerified && user?.role === "teacher") {
    return <Navigate to="/teacher" replace />;
  }

  if (isAuthenticated && isTeacherVerified && teacher?.role === "teacher") {
    return <Navigate to="/teacher" replace />;
  }

  if (isAuthenticated && isUserVerified && user?.role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  if (isAuthenticated && isTeacherVerified && teacher?.role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  return children;
};

function App() {
  const { isCheckingAuth, checkAuth, isAuthenticated } = useAuthStore();

  useEffect(() => {
    const fetchAuthStatus = async () => {
      await checkAuth();
    };
    fetchAuthStatus();
  }, [checkAuth]);

  // Show a loading spinner while checking authentication status
  if (isCheckingAuth) return <LoadingSpinner />;

  return (
    <div className="h-screen  flex flex-col items-center space-y-10"
    style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            height: "100vh",
          }}
    >
    
      <Routes>
        {/* Protected Routes */}
        <Route
          path="/student"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher"
          element={
            <ProtectedRoute allowedRoles={["teacher"]}>
              <TeacherDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/studentdetails"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <StudentCard />
            </ProtectedRoute>
          }
        />

        {/* Public Routes */}
        <Route
          path="/signup"
          element={
            <RedirectAuthenticatedUser>
              <StudentSignUp />
            </RedirectAuthenticatedUser>
          }
        />
        <Route
          path="/login"
          element={
            <RedirectAuthenticatedUser>
              <LoginPage />
            </RedirectAuthenticatedUser>
          }
        />
        <Route path="/verify-email" element={<EmailVerificationPage />} />
        <Route
          path="/forgot-password"
          element={
            <RedirectAuthenticatedUser>
              <ForgotPasswordPage />
            </RedirectAuthenticatedUser>
          }
        />
        <Route
          path="/reset-password/:token"
          element={
            <RedirectAuthenticatedUser>
              <ResetPasswordPage />
            </RedirectAuthenticatedUser>
          }
        />

        {/* Landing Page */}
        <Route path="/" element={<Landing />} />

        {/* Catch-All Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;

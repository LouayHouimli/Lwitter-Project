import SignupPage from "./pages/auth/signup/SignUpPage";
import HomePage from "./pages/home/HomePage";
import LoginPage from "./pages/auth/login/LoginPage";
import RightPanel from "./components/common/RightPanel";
import NotificationPage from "./pages/notification/NotificationPage";
import ProfilePage from "./pages/profile/ProfilePage";
import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/common/SideBar";
import { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "./components/common/LoadingSpinner";

function App() {
  const {
    data: authUser,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/auth/me", {
          method: "GET",
        });
        if (!res.ok) {
          throw new Error("Failed to fetch user data");
        }
        const data = await res.json();
        return data;
      } catch (error) {
        return null;
      }
    },
  });

  if (isLoading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="flex max-w-6xl mx-auto">
      {authUser && (
        <Sidebar username={authUser.username} fullName={authUser.fullname} />
      )}
      <Routes>
        <Route
          path="/"
          element={
            authUser ? <Navigate to="/home" /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/notifications"
          element={!authUser ? <Navigate to="/login" /> : <NotificationPage />}
        />
        <Route
          path="/home"
          element={authUser ? <HomePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to="/home" />}
        />
        <Route
          path="/signup"
          element={!authUser ? <SignupPage /> : <Navigate to="/home" />}
        />
        <Route
          path="/profile"
          element={!authUser ? <Navigate to="/login" /> : <ProfilePage />}
        />
        <Route
          path="/profile/:user"
          element={!authUser ? <Navigate to="/login" /> : <ProfilePage />}
        />
      </Routes>
      {authUser && <RightPanel />}
      <Toaster />
    </div>
  );
}

export default App;

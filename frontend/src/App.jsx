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
import Settings from "./pages/profile/Settings";
import Bookmark from "./pages/bookmarks/bookmark";
import Explore from "./pages/home/Explore";
import Messages from "./pages/messages/messages";
import { useEffect } from "react";
import PostPreview from "./pages/post/PostPreview";
import { useState } from "react";
import ModPanel from "./pages/mod/mod";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentFailure from "./pages/PaymentFailure";

function App() {
  const [theme, setTheme] = useState("retro"); // Initial theme
  const { data: notifications, isLoading: isNotificating } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/notifications", {
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

  useEffect(() => {
    if (authUser && authUser.Settings.Appearance) {
      setTheme(authUser.Settings.Appearance);
    }
  }, [authUser]);

  // Apply the theme to the HTML element
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // Toggle between themes
  const toggleTheme = () => {
    const newTheme = theme === "retro" ? "dark" : "retro"; // Change theme
    setTheme(newTheme);
  };

  if (isLoading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="flex max-w-6xl mx-auto ">
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
          path="/profile/:username"
          element={!authUser ? <Navigate to="/login" /> : <ProfilePage />}
        />
        <Route
          path="/settings"
          element={!authUser ? <Navigate to="/login" /> : <Settings />}
        />
        <Route
          path="/bookmarks"
          element={!authUser ? <Navigate to="/login" /> : <Bookmark />}
        />
        <Route
          path="/post/:id"
          element={!authUser ? <Navigate to="/login" /> : <PostPreview />}
        />
        <Route
          path="/explore"
          element={!authUser ? <Navigate to="/login" /> : <Explore />}
        />
        <Route
          path="/explore/:search"
          element={!authUser ? <Navigate to="/login" /> : <Explore />}
        />
        <Route
          path="/messages"
          element={!authUser ? <Navigate to="/login" /> : <Messages />}
        />
        <Route
          path="/modpanel"
          element={authUser?.isMod ? <ModPanel /> : <Navigate to="/" />}
        />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/payment-failure" element={<PaymentFailure />} />
      </Routes>

      {authUser && <RightPanel />}
      <Toaster />
    </div>
  );
}

export default App;

import { Routes, Route, Navigate } from "react-router-dom";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import GroupsPage from "./pages/GroupsPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import HomePage from "./pages/HomePage";
import BucketListPage from "./pages/BucketListPage";
import NavBar from "./components/NavBar";
import { useAuthStore } from "./store/useAuthStore";
import { Toaster } from "react-hot-toast";
import { Group } from "lucide-react";

function App() {
  const { authUser } = useAuthStore();
  return (
    <>
      <Toaster position="top-center" /> {/*Toast notifications*/}
      {/*Show the NavBar only if the user is authenticated (not on signup or login pages)*/}
      {authUser && <NavBar />}
      <div className={authUser && "pt-16"}>
        {/*Padding to avoid content being hidden behind the fixed NavBar*/}
        <Routes>
          <Route path="/" element={<SignupPage />} />
          <Route
            path="/signup"
            element={!authUser ? <SignupPage /> : <Navigate to="/" />}
          />
          <Route
            path="/login"
            element={!authUser ? <LoginPage /> : <Navigate to="/" />}
          />
          <Route
            path="/profile"
            element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
          />
          <Route
            path="/groups"
            element={authUser ? <GroupsPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/leaderboard"
            element={authUser ? <LeaderboardPage /> : <Navigate to="/" />}
          />
          <Route
            path="/bucketlist"
            element={authUser ? <BucketListPage /> : <Navigate to="/login" />}
          />
        </Routes>
      </div>
    </>
  );
}

export default App;

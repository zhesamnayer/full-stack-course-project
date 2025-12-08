import './App.css'

import Sidebar from "./components/Sidebar";
import Dashboard from "./Dashboard"
import { Routes, Route, useLocation  } from 'react-router-dom';
import Incomes from "./Incomes";
import Expenses from "./Expenses";
import Category from "./Category";
import Upcoming from "./Upcoming";
import Login from './Login';
import Logout from './Logout';
import Users from './Users';
import Signup from './Signup';
import Userinfo from './Userinfo';
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function App() {

  const location = useLocation();

  // Check if current page is login
  const hideSidebar = location.pathname === "/login" || location.pathname === "/signup";

    const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const currentPath = location.pathname;

    // Allow access to login and signup pages even without token
    const publicPaths = ["/login", "/signup"];

    // If no token and trying to access protected route, redirect to login
    if (!token && !publicPaths.includes(currentPath)) {
      console.log("No token found, redirecting to login from:", currentPath);
      navigate("/login", { replace: true });
      return;
    }

    // If user has token and is on login page, redirect to dashboard
    if (token && currentPath === "/login") {
      console.log("Token found, redirecting to dashboard from login");
      navigate("/", { replace: true });
      return;
    }
  }, [navigate, location.pathname]);


  return (
    <div className="App" style={{ display: "flex" }}>
      {!hideSidebar && <Sidebar />}

      <div style={{ flex: 1 }}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/incomes" element={<Incomes />} />
        <Route path="/expenses" element={<Expenses />} />
        <Route path="/categories" element={<Category />} />
        <Route path="/upcoming" element={<Upcoming />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/userinfo" element={<Userinfo />} />
        <Route path="/users" element={<Users />} />
        <Route path="/signup" element={<Signup />} />
        {/* Catch-all route for unknown paths - redirect to login */}
        <Route path="*" element={<Login />} />
      </Routes>
      </div>
    </div>
  );
}

export default App

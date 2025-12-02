import './App.css'

import Sidebar from "./components/Sidebar";
import Dashboard from "./Dashboard"
import { Routes, Route, useLocation  } from 'react-router-dom';
import Incomes from "./Incomes";
import Expenses from "./Expenses";
import Login from './Login';
import Logout from './Logout';
import Report from './Report';
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

    if (!token && !publicPaths.includes(currentPath)) {
      navigate("/login"); // redirect to login only for protected routes
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
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/report" element={<Report />} />
        <Route path="/userinfo" element={<Userinfo />} />
        <Route path="/users" element={<Users />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
      </div>
    </div>
  );
}

export default App

import './App.css'

import Sidebar from "./components/Sidebar";
import Dashboard from "./Dashboard"
import { Routes, Route, useLocation  } from 'react-router-dom';
import Incomes from "./Incomes";
import Expenses from "./Expenses";
import Login from './Login';
import Logout from './Logout';


function App() {

  const location = useLocation();

  // Check if current page is login
  const hideSidebar = location.pathname === "/login";


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
      </Routes>
      </div>
    </div>
  );
}

export default App

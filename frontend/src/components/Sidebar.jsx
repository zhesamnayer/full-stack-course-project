// import React, { useState } from "react";
import "../App.css";
// import Dashboard from "../Dashboard"
import { SidebarData } from "../SidebarData";

function Sidebar() {

  const role = getRoleFromToken();

  return (
    <div className="Sidebar">
      <ul className="SidebarList">
        {SidebarData.map((val, key) => {

        // CONDITION: hide an item if it's "users" and the role is not "users"
        if (val.title === "Users" && role == "user") {
          return null; // don't render
        }

          return (
            <li 
              key={key}
              className="row"
              id={window.location.pathname == val.link ? "active" : ""}
              onClick={() => {
                window.location.pathname = val.link;
              }}
            >
            {" "}
            <div id="icon">{val.icon}</div>
            <div id="title">
              {val.title}
            </div>
          </li>
          );
        })}
      </ul>
    </div>
  );
}

export default Sidebar;

export function getRoleFromToken() {
  const token = sessionStorage.getItem("token");

  if (!token) return null;

  // JWT structure: header.payload.signature
  const parts = token.split(".");
  if (parts.length !== 3) return null;

  try {
    const payload = JSON.parse(atob(parts[1]));
    return payload.role || payload["role"] || payload.claims?.role || null;
  } catch (e) {
    console.error("Invalid token:", e);
    return null;
  }
}
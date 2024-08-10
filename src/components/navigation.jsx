// components/Navigation.jsx
import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../components/AuthContext";

export const Navigation = () => {
  const { isAuthenticated, username, logout, userRole } = useContext(AuthContext); // Include userRole
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/"); // Redirect to home after logout
  };

  return (
    <nav id="menu" className="navbar navbar-default navbar-fixed-top">
      <div className="container">
        <div className="navbar-header">
          <button
            type="button"
            className="navbar-toggle collapsed"
            data-toggle="collapse"
            data-target="#bs-example-navbar-collapse-1"
          >
            <span className="sr-only">Toggle navigation</span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
          </button>
          <a className="navbar-brand page-scroll" href="#page-top">
            Taxi APP
          </a>
        </div>

        <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
          <ul className="nav navbar-nav navbar-right">
            <li>
              <a href="#features" className="page-scroll">Features</a>
            </li>
            {/* Other links... */}
            {isAuthenticated ? (
              <>
                {userRole === 'superadmin' && (
                  <li>
                    <Link to="/superadmin/dashboard" className="page-scroll">Superadmin Dashboard</Link>
                  </li>
                )}
                <li>
                  <span className="navbar-text">Welcome, {username}</span>
                </li>
                <li>
                  <button className="btn btn-link navbar-btn" onClick={handleLogout}>Logout</button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/login" className="page-scroll">Login</Link>
                </li>
                <li>
                  <Link to="/register" className="page-scroll">Register</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

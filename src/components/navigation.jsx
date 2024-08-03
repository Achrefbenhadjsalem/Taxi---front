import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../components/AuthContext";

export const Navigation = () => {
  const { isAuthenticated, username, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/"); // Rediriger vers la page d'accueil après la déconnexion
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
            <li>
              <a href="#about" className="page-scroll">About</a>
            </li>
            <li>
              <a href="#services" className="page-scroll">Services</a>
            </li>
            <li>
              <a href="#portfolio" className="page-scroll">Gallery</a>
            </li>
            <li>
              <a href="#testimonials" className="page-scroll">Testimonials</a>
            </li>
            <li>
              <a href="#team" className="page-scroll">Team</a>
            </li>
            <li>
              <a href="#contact" className="page-scroll">Contact</a>
            </li>
            {isAuthenticated ? (
              <>
                <li>
                  <Link to="/map" className="page-scroll">Map</Link>
                </li>
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

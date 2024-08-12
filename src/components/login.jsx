import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../components/AuthContext";
import "./Login.css";

export const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/api/users/login", {
        username,
        password,
      });

      const token = response.data.token; // Assurez-vous que l'API renvoie un token
      localStorage.setItem("authToken", token); // Sauvegarder le token dans le localStorage

      setSuccess("Login successful!");
      setError("");
      login(username); // Mettre à jour l'état d'authentification
      navigate("/payment"); // Rediriger vers la page de paiement
    } catch (error) {
      setError("Login failed. " + (error.response?.data?.error || error.message));
      setSuccess("");
    }
  };

  return (
    <div className="login-container">
      <div className="form-container">
        <h1>Login</h1>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="submit-button">Login</button>
        </form>
        <div className="register-link">
          <a href="/register">Register Here</a>
        </div>
      </div>
    </div>
  );
};

export default Login;

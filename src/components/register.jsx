import React, { useState } from "react";
import axios from "axios";
import "./Register.css";

export const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Client"); // Ajoutez ce champ pour le rôle
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setSuccess("");
      return;
    }
    try {
      await axios.post("http://localhost:3000/api/users/register", {
        username,
        password,
        email,
        role, // Envoyez le rôle avec les autres informations
      });
      setSuccess("Registration successful!");
      setError("");
    } catch (error) {
      setError("Registration failed. " + (error.response?.data?.error || error.message));
      setSuccess("");
    }
  };

  return (
    <div className="register-container">
      <div className="form-container">
        <h1>Register</h1>
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
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="role">Role</label>
            <select
              id="role"
              name="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="Client">Client</option>
              <option value="Driver">Driver</option>
            </select>
          </div>
          <button type="submit" className="submit-button">Register</button>
        </form>
        <div className="login-link">
          <a href="/login">Login Here</a>
        </div>
      </div>
    </div>
  );
};

export default Register;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../components/Login.css";
import logo from "../assets/logo.svg";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8080/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        setMessage(`❌ Registration failed: ${errorText}`);
        return;
      }

      setMessage("✅ Registration successful! You can now log in.");
      setTimeout(() => navigate("/login"), 1500);
    } catch (error) {
      console.error("❌ Error:", error);
      setMessage("❌ Something went wrong during registration.");
    }
  }

  return (
    <div className="login-wrapper">
      <div className="login-left">
        <h1 className="login-title">Create your account</h1>

        <form className="login-form" onSubmit={handleSubmit}>
          <div>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              required
            />
          </div>

          <div>
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="yourpassword"
              required
            />
          </div>

          <button type="submit">Register</button>

          <div className="login-links">
            <a
              onClick={() => navigate("/login")}
              className="register-link"
              style={{ cursor: "pointer" }}
            >
              Already have an account? Sign In
            </a>
          </div>

          {message && <p className="login-message">{message}</p>}
        </form>
      </div>

      <div className="login-right">
        <img src={logo} alt="PawWell logo" />
      </div>
    </div>
  );
}
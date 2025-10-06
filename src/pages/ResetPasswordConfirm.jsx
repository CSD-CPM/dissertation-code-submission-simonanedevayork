import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "../components/Login.css";
import logo from "../assets/logo.svg";

export default function ResetPasswordConfirm() {
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token"); // ✅ get token from URL

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8080/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: token,
          newPassword: newPassword,
        }),
      });

      if (!response.ok) {
        setMessage("❌ Failed to reset password. Token may have expired.");
        return;
      }

      setMessage("✅ Password reset successfully! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);

    } catch (error) {
      console.error("❌ Error:", error);
      setMessage("❌ Something went wrong.");
    }
  }

  return (
    <div className="login-wrapper">
      <div className="login-left">
        <h1 className="login-title">Set a new password</h1>

        <form className="login-form" onSubmit={handleSubmit}>
          <div>
            <label>New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter your new password"
            />
          </div>

          <button type="submit">Reset Password</button>

          <p
            className="forgot-password"
            onClick={() => navigate("/login")}
          >
            ← Back to Login
          </p>

          {message && <p className="login-message">{message}</p>}
        </form>
      </div>

      <div className="login-right">
        <img src={logo} alt="PawWell logo" />
      </div>
    </div>
  );
}
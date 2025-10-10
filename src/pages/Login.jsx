import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../components/Login.css";
import logo from "../assets/logo.svg";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        setMessage("❌ Login failed!");
        return;
      }

      const data = await response.json();
      console.log("✅ Login success:", data);

      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("participantId", data.participantId);
        localStorage.setItem("tokenType", data.type || "Bearer");
        setMessage("✅ Login successful!");

        // check if user has a dog, and if not - redirect to create dog page
        const checkDogResponse = await fetch(
          `http://localhost:8080/users/${data.participantId}/dog`,
          {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${data.token}`,
              "Content-Type": "application/json",
            },
          }
        );
        
        if (checkDogResponse.status === 404) {
          console.log("❌ No dog found — redirecting to create page...");
          navigate("/create-dog");
        } else if (checkDogResponse.ok) {
          console.log("✅ Dog found — redirecting to dashboard...");
          navigate("/dashboard");
        } else {
          console.error("⚠️ Unexpected response from dog check:", checkDogResponse.status);
          setMessage("⚠️ Error checking dog profile.");
        }
        
      } else {
        setMessage("⚠️ Logged in but no token received");
      }
    } catch (error) {
      console.error("❌ Error:", error);
      setMessage("❌ Something went wrong.");
    }
  }

  return (
    <div className="login-wrapper">
      <div className="login-left">
        <h1 className="login-title">Access your account</h1>

        <form className="login-form" onSubmit={handleSubmit}>
          <div>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
            />
          </div>

          <div>
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="yourpassword"
            />
          </div>

          <button type="submit">Sign In</button>

          <a
          onClick={() => navigate("/forgot-password")}
          className="forgot-password"
           style={{ cursor: "pointer" }}
          >
           Forgot password?
          </a>


          {message && <p className="login-message">{message}</p>}
        </form>
      </div>

      <div className="login-right">
        <img src={logo} alt="PawWell logo" />
      </div>
    </div>
  );
}
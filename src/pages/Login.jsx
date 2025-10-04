import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        setMessage("❌ Login failed!");
        return;
      }

      const data = await response.json();
      console.log("✅ Login success:", data);

      if (data.token) {

        // store token in localStorage to access them later
        localStorage.setItem("token", data.token);
        localStorage.setItem("participantId", data.participantId);
        localStorage.setItem("tokenType", data.type || "Bearer");

        setMessage("✅ Login successful!");

        console.log("Redirecting to dashboard.");
        navigate("/dashboard");
      } else {
        setMessage("⚠️ Logged in but no token received");
      }
    } catch (error) {
      console.error("❌ Error:", error);
      setMessage("❌ Something went wrong.");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{ width: 400, padding: 20, display: "flex", flexDirection: "column", gap: 16 }}
    >
      <div>
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: "100%", padding: 12, borderRadius: 8, border: "1px solid #D9D9D9" }}
        />
      </div>

      <div>
        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", padding: 12, borderRadius: 8, border: "1px solid #D9D9D9" }}
        />
      </div>

      <button
        type="submit"
        style={{
          padding: 12,
          background: "#2C2C2C",
          color: "white",
          border: "none",
          borderRadius: 8,
          cursor: "pointer",
        }}
      >
        Sign In
      </button>

      {message && <p>{message}</p>}
    </form>
  );
}
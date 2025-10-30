import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Layout.css";
import "../styles/PageHeader.css";
import "../components/Login.css";
import logo from "../assets/logo.svg";
import { authFetch } from "../utils/apiClient";

export default function AddWeightRecord() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    current: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("⚖️ Submitting new weight record...");

    try {
      const participantId = localStorage.getItem("participantId");
      if (!participantId) {
        navigate("/login");
        return;
      }

      let dogId = localStorage.getItem("dogId");
      if (!dogId) {
        const dogData = await authFetch(
          `http://localhost:8080/users/${participantId}/dog`,
          { method: "GET" },
          navigate
        );
        if (!dogData?.dogId) {
          setMessage("❌ No dog found for this user.");
          return;
        }
        dogId = dogData.dogId;
        localStorage.setItem("dogId", dogId);
      }

      const body = {
        current: formData.current ? Number(formData.current) : null,
      };

      const res = await authFetch(
        `http://localhost:8080/dogs/${dogId}/weights`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        },
        navigate
      );

      if (!res) {
        setMessage("❌ Failed to add weight record.");
        return;
      }

      setMessage("✅ Weight record added successfully!");
      setTimeout(() => navigate("/weight"), 1500);
    } catch (err) {
      console.error("❌ Submission failed:", err);
      setMessage("❌ Failed to submit record.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-wrapper">
      <div className="login-left">
        <h1 className="login-title">Add Weight Record</h1>

        <form className="login-form" onSubmit={handleSubmit}>
          <div>
            <label>Current Weight (kg)</label>
            <input
              type="number"
              step="0.1"
              name="current"
              value={formData.current}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, current: e.target.value }))
              }
              placeholder="Enter current weight"
              required
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Add Record"}
          </button>

          <p
            className="forgot-password"
            onClick={() => navigate("/weight")}
            style={{ cursor: "pointer" }}
          >
            ← Back to Weight Records
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
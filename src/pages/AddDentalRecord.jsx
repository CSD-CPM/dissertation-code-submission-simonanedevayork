import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Layout.css";
import "../styles/PageHeader.css";
import "../components/Login.css";
import logo from "../assets/logo.svg";
import { authFetch } from "../utils/apiClient";

export default function AddDentalRecord() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    plaqueStatus: "",
    toothLoss: false,
    gingivitisStatus: "",
    lastCleaningDate: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadLastCleaningDate = async () => {
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
          if (!dogData?.dogId) return;
          dogId = dogData.dogId;
          localStorage.setItem("dogId", dogId);
        }

        const data = await authFetch(
          `http://localhost:8080/dogs/${dogId}/dental`,
          { method: "GET" },
          navigate
        );

        if (data && data.length > 0) {
          const latest = data[0];
          if (latest.lastCleaningDate) {
            setFormData((prev) => ({
              ...prev,
              lastCleaningDate: latest.lastCleaningDate,
            }));
          }
        }
      } catch (err) {
        console.error("[Dental] Prefill fetch failed:", err);
      }
    };

    loadLastCleaningDate();
  }, [navigate]);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("🦷 Submitting dental record...");

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
        plaqueStatus: formData.plaqueStatus,
        toothLoss: formData.toothLoss,
        gingivitisStatus: formData.gingivitisStatus,
        lastCleaningDate: formData.lastCleaningDate || null,
      };

      const res = await authFetch(
        `http://localhost:8080/dogs/${dogId}/dental`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        },
        navigate
      );

      if (!res) {
        setMessage("❌ Failed to add dental record.");
        return;
      }

      setMessage("✅ Dental record added successfully!");
      setTimeout(() => navigate("/dental"), 1500);
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
        <h1 className="login-title">Add Dental Record</h1>

        <form className="login-form" onSubmit={handleSubmit}>
          <div>
            <label>Plaque Status</label>
            <select
              name="plaqueStatus"
              value={formData.plaqueStatus}
              onChange={handleChange}
              required
            >
              <option value="">Select</option>
              <option value="LO">Mild</option>
              <option value="NORM">Moderate</option>
              <option value="HI">High</option>
            </select>
          </div>

          <label className="checkbox-label">
            <input
              type="checkbox"
              name="toothLoss"
              checked={formData.toothLoss}
              onChange={handleChange}
            />
            Tooth Loss
          </label>

          <div>
            <label>Gingivitis Status</label>
            <select
              name="gingivitisStatus"
              value={formData.gingivitisStatus}
              onChange={handleChange}
              required
            >
              <option value="">Select</option>
              <option value="NONE">None</option>
              <option value="MILD">Mild</option>
              <option value="SEVERE">Severe</option>
            </select>
          </div>

          <div>
            <label>Last Cleaning Date</label>
            <input
              type="date"
              name="lastCleaningDate"
              value={formData.lastCleaningDate || ""}
              onChange={handleChange}
            />
            <p style={{ fontSize: "14px", color: "#555", marginTop: "4px" }}>
              If unchanged, keep the same date.
            </p>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Add Record"}
          </button>

          <p
            className="forgot-password"
            onClick={() => navigate("/dental")}
            style={{ cursor: "pointer" }}
          >
            ← Back to Dental Records
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
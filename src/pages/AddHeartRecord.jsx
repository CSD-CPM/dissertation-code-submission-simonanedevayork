import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Layout.css";
import "../styles/PageHeader.css";
import "../components/Login.css";
import logo from "../assets/logo.svg";
import { authFetch } from "../utils/apiClient";

export default function AddHeartRecord() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fatigue: false,
    coughing: false,
    murmurStatus: "",
    heartRate: "",
    breathingRate: "",
    lastDirofilariaPreventionDate: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadLastPreventionDate = async () => {
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
          `http://localhost:8080/dogs/${dogId}/heart`,
          { method: "GET" },
          navigate
        );

        if (data && data.length > 0) {
          const latest = data[0];
          if (latest.lastDirofilariaPreventionDate) {
            setFormData((prev) => ({
              ...prev,
              lastDirofilariaPreventionDate: latest.lastDirofilariaPreventionDate,
            }));
          }
        }
      } catch (err) {
        console.error("[Heart] Prefill fetch failed:", err);
      }
    };

    loadLastPreventionDate();
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
    setMessage("❤️ Submitting new heart record...");

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
        fatigue: formData.fatigue,
        coughing: formData.coughing,
        murmurStatus: formData.murmurStatus || null,
        heartRate: formData.heartRate ? Number(formData.heartRate) : null,
        breathingRate: formData.breathingRate ? Number(formData.breathingRate) : null,
        lastDirofilariaPreventionDate: formData.lastDirofilariaPreventionDate || null,
      };

      const res = await authFetch(
        `http://localhost:8080/dogs/${dogId}/heart`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        },
        navigate
      );

      if (!res) {
        setMessage("❌ Failed to add record.");
        return;
      }

      setMessage("✅ Heart record added successfully!");
      setTimeout(() => navigate("/heart"), 1500);
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
        <h1 className="login-title">Add Heart Record</h1>

        <form className="login-form" onSubmit={handleSubmit}>

          <h3 style={{ marginTop: "10px", borderBottom: "1px solid #ccc", paddingBottom: "4px" }}>
            Self-examination
          </h3>

          <label className="checkbox-label">
            <input
              type="checkbox"
              name="fatigue"
              checked={formData.fatigue}
              onChange={handleChange}
            />
            Fatigue
          </label>

          <label className="checkbox-label">
            <input
              type="checkbox"
              name="coughing"
              checked={formData.coughing}
              onChange={handleChange}
            />
            Coughing
          </label>

          <h3 style={{ marginTop: "20px", borderBottom: "1px solid #ccc", paddingBottom: "4px" }}>
            Vet Records (leave empty if none)
          </h3>

          <div>
            <label>Murmur Status</label>
            <select
              name="murmurStatus"
              value={formData.murmurStatus}
              onChange={handleChange}
            >
              <option value="">Select</option>
              <option value="NONE">None</option>
              <option value="GRADE_I">Grade I</option>
              <option value="GRADE_II">Grade II</option>
              <option value="Grade_III">Grade III</option>
              <option value="Grade_IV">Grade IV</option>
              <option value="Grade_V">Grade V</option>
              <option value="Grade_VI">Grade VI</option>
            </select>
          </div>

          <div>
            <label>Heart Rate (bpm)</label>
            <input
              type="number"
              name="heartRate"
              value={formData.heartRate}
              onChange={handleChange}
              placeholder="120"
            />
          </div>

          <div>
            <label>Breathing Rate (rpm)</label>
            <input
              type="number"
              name="breathingRate"
              value={formData.breathingRate}
              onChange={handleChange}
              placeholder="25"
            />
          </div>

          <h3 style={{ marginTop: "20px", borderBottom: "1px solid #ccc", paddingBottom: "4px" }}>
            Dirofilaria Prevention
          </h3>

          <div>
            <label>Last Prevention Date</label>
            <input
              type="date"
              name="lastDirofilariaPreventionDate"
              value={formData.lastDirofilariaPreventionDate || ""}
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
            onClick={() => navigate("/heart")}
            style={{ cursor: "pointer" }}
          >
            ← Back to Heart Records
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
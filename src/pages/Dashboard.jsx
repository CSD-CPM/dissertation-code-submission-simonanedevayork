import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authFetch } from "../utils/apiClient";
import "../styles/Layout.css";
import "../styles/PageHeader.css";
import "../styles/Dashboard.css";

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [dog, setDog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const participantId = localStorage.getItem("participantId");
        if (!participantId) {
          navigate("/login");
          return;
        }

        const dogData = await authFetch(
          `http://localhost:8080/users/${participantId}/dog`,
          { method: "GET" },
          navigate
        );
        setDog(dogData);

        const data = await authFetch(
          `http://localhost:8080/users/${participantId}/dashboard`,
          { method: "GET" },
          navigate
        );
        if (!data) return;

        setDashboardData(data);
      } catch (err) {
        console.error("[Dashboard] Error:", err);
        setErrorMsg("Could not load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [navigate]);

  if (loading) return <p>Loading dashboard…</p>;
  if (errorMsg) return <p style={{ color: "red" }}>{errorMsg}</p>;
  if (!dashboardData || !dog) return null;

  const { currentWeight, hormonesStatus, mobilityStatus, totalDentalRecords, totalHeartRecords, totalHealthRecords, healthHighlights } =
    dashboardData;

  const colorCircle = (status) =>
    status === "green" ? "🟢" : status === "yellow" ? "🟡" : "🔴";

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>
          Digital Dog Health Tracker
          <br />
          Overview
        </h1>
      </div>

      <div className="dashboard-top">
        <div className="welcome-card">
          <h3>Welcome, {dog.name}!</h3>
          {dog.photoUrl ? (
            <img src={dog.photoUrl} alt={dog.name} className="dog-photo" />
          ) : (
            <div className="dog-photo-placeholder">🐶</div>
          )}
        </div>

        <div className="stat-card">
          <h3>Current Weight</h3>
          <p className="stat-value">
            {currentWeight ? `${Number(currentWeight).toFixed(1)} kg` : "—"}
          </p>
        </div>

        <div className="stat-card">
          <h3>Dental Records</h3>
          <p className="stat-value">{totalDentalRecords ?? 0}</p>
        </div>

        <div className="stat-card">
          <h3>Heart Records</h3>
          <p className="stat-value">{totalHeartRecords ?? 0}</p>
        </div>

        <div className="stat-card">
          <h3>Health Records</h3>
          <p className="stat-value">{totalHealthRecords ?? 0}</p>
        </div>
      </div>

      <div className="dashboard-middle">
        <div className="section-card">
          <h2>Hormone Status</h2>
          {Object.entries(hormonesStatus)
            .filter(([k]) => k !== "healthHighlights")
            .map(([key, value]) => (
              <p key={key}>
                <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong>{" "}
                {colorCircle(value)}
              </p>
            ))}
        </div>

        <div className="section-card">
          <h2>Mobility Status</h2>
          {Object.entries(mobilityStatus)
            .filter(([k]) => k !== "healthHighlights")
            .map(([key, value]) => (
              <p key={key}>
                <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong>{" "}
                {colorCircle(value)}
              </p>
            ))}
        </div>
      </div>

      <div className="dashboard-bottom">
        <div className="highlights-card">
          <h2>Health Highlights</h2>
          {(!healthHighlights || healthHighlights.length === 0) ? (
            <p>No highlights available.</p>
          ) : (
            healthHighlights.map((h, idx) => (
              <div key={idx} className="highlight-item">
                <p><strong>{h.title}</strong></p>
                <p>{h.description}</p>
                {h.advice && <p><em>{h.advice}</em></p>}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
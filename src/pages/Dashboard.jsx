import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authFetch } from "../utils/apiClient";
import "../styles/Layout.css";
import "../styles/PageHeader.css";

export default function Dashboard() {
  const [currentWeight, setCurrentWeight] = useState(null);
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

        const url = `http://localhost:8080/users/${participantId}/dashboard`;
        const data = await authFetch(url, { method: "GET" }, navigate);

        if (!data) return;
        
        setCurrentWeight(data.currentWeight ?? null);
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

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>
          Digital Dog Health Tracker
          <br />
          Dashboard
        </h1>
      </div>

      <p>
        <strong>Current Weight:</strong>{" "}
        {currentWeight === null || currentWeight === undefined
          ? "—"
          : `${Number(currentWeight).toFixed(1)} kg`}
      </p>
    </div>
  );
}
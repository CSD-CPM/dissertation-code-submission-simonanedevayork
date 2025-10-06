// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Layout.css";

export default function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboard = async () => {
      // 1) read saved token and participant id from localStorage
      const token = localStorage.getItem("token");
      const tokenType = localStorage.getItem("tokenType") || "Bearer";
      const participantId = localStorage.getItem("participantId");

      console.log("[Dashboard] token:", token);
      console.log("[Dashboard] tokenType:", tokenType);
      console.log("[Dashboard] participantId:", participantId);

      // If not logged in (no token/participant) -> redirect to login
      if (!token || !participantId) {
        console.warn("[Dashboard] missing token or participantId -> redirecting to /login");
        navigate("/login");
        return;
      }

      try {
        const url = `http://localhost:8080/users/${participantId}/dashboard`;
        console.log("[Dashboard] fetching", url);

        const res = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            // build Authorization header using the stored token type
            Authorization: `${tokenType} ${token}`,
          },
        });

        console.log("[Dashboard] response status:", res.status, res.statusText);

        // Read text safely (handles empty body)
        const text = await res.text();
        console.log("[Dashboard] raw response text:", text);

        let data;
        try {
          data = text ? JSON.parse(text) : {};
        } catch (parseErr) {
          console.error("[Dashboard] JSON parse error:", parseErr);
          data = {};
        }

        if (!res.ok) {
          // 401 / 403 → logged out or invalid token: clear storage and go to login
          if (res.status === 401 || res.status === 403) {
            console.warn("[Dashboard] unauthorized - clearing credentials and redirecting");
            localStorage.removeItem("token");
            localStorage.removeItem("participantId");
            localStorage.removeItem("tokenType");
            navigate("/login");
            return;
          }

          // other server error -> show message but don't redirect
          setErrorMsg(`Server error: ${res.status}`);
          setDashboard(null);
          return;
        }

        console.log("[Dashboard] parsed data:", data);
        // set into state (will be rendered)
        setDashboard(data);
      } catch (err) {
        console.error("[Dashboard] fetch exception:", err);
        setErrorMsg("Network error or backend unreachable.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  if (loading) return <p>Loading dashboard…</p>;
  if (errorMsg) return <div><p style={{ color: "red" }}>{errorMsg}</p></div>;

  // If backend returned empty object or no meaningful fields
  if (!dashboard || Object.keys(dashboard).length === 0) {
    return <p>No dashboard data available.</p>;
  }

  // Destructure expected fields with safe defaults
  const {
    overallHealthIndex = null,
    currentWeight = null,
    yourProgress = null,
    healthHighlights = null,
    quizHighlights = null,
  } = dashboard;

  return (
    <div className="page-container">
      <h1>Dashboard</h1>

      <p>
        <strong>Overall health index:</strong>{" "}
        {overallHealthIndex === null ? "—" : String(overallHealthIndex)}
      </p>

      <p>
        <strong>Current weight:</strong>{" "}
        {currentWeight === null ? "—" : (Number(currentWeight).toFixed(1) + " kg")}
      </p>

      <p>
        <strong>Your progress:</strong>{" "}
        {yourProgress === null ? "—" : `${yourProgress}%`}
      </p>

      <section>
        <h2>Health highlights</h2>
        {Array.isArray(healthHighlights) && healthHighlights.length > 0 ? (
          <ul>
            {healthHighlights.map((h, idx) => (
              <li key={idx}>
                <strong>{h.title}</strong>
                {h.description && <div>{h.description}</div>}
                {h.advice && <div><em>{h.advice}</em></div>}
              </li>
            ))}
          </ul>
        ) : (
          <p>No health highlights.</p>
        )}
      </section>

      <section>
        <h2>Quiz highlights</h2>
        {Array.isArray(quizHighlights) && quizHighlights.length > 0 ? (
          <ul>
            {quizHighlights.map((q, idx) => (
              <li key={idx}>
                <strong>{q.title}</strong>
                {q.description && <div>{q.description}</div>}
                {q.link && <div><a href={q.link}>{q.link}</a></div>}
              </li>
            ))}
          </ul>
        ) : (
          <p>No quiz highlights.</p>
        )}
      </section>
    </div>
  );
}
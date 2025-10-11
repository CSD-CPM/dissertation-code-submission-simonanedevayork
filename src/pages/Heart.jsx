import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCalendarAlt, FaTrashAlt } from "react-icons/fa";
import "../styles/Layout.css";
import "../styles/PageHeader.css";
import "../styles/Heart.css";
import { authFetch } from "../utils/apiClient";

export default function Heart() {
  const [records, setRecords] = useState([]);
  const [highlights, setHighlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHeartData = async () => {
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
            setErrorMsg("No dog found for this user.");
            setLoading(false);
            return;
          }
          dogId = dogData.dogId;
          localStorage.setItem("dogId", dogId);
        }

        const heartRecords = await authFetch(
          `http://localhost:8080/dogs/${dogId}/heart`,
          { method: "GET" },
          navigate
        );

        if (!heartRecords) {
          setErrorMsg("Could not load heart data.");
          return;
        }

        setRecords(heartRecords);
        setHighlights(heartRecords[0]?.healthHighlights || []);
      } catch (err) {
        console.error("[Heart] Fetch failed:", err);
        setErrorMsg("Could not load heart data.");
      } finally {
        setLoading(false);
      }
    };

    fetchHeartData();
  }, [navigate]);

  async function handleDelete(heartId) {
    if (!window.confirm("Are you sure you want to delete this heart record?")) return;

    try {
      const dogId = localStorage.getItem("dogId");

      const res = await authFetch(
        `http://localhost:8080/dogs/${dogId}/heart/${heartId}`,
        { method: "DELETE" },
        navigate
      );

      if (!res) {
        alert("❌ Failed to delete record.");
        return;
      }

      setRecords((prev) => prev.filter((r) => r.heartId !== heartId));
    } catch (err) {
      console.error("[Delete] Failed:", err);
      alert("❌ Failed to delete record.");
    }
  }

  if (loading) return <p>Loading heart records…</p>;
  if (errorMsg) return <p style={{ color: "red" }}>{errorMsg}</p>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Digital Dog Health Tracker<br />Heart Tracker</h1>
      </div>

      <div className="records-header">
        <div className="records-controls">
          <span className="record-count">
            {records.length} {records.length === 1 ? "record" : "records"}
          </span>
          <button className="add-new" onClick={() => navigate("/heart/add")}>
            Add New
          </button>
        </div>
      </div>

      <div className="heart-bottom">
        <div className="heart-records">
          <h2>Heart Records</h2>

          {records.length === 0 ? (
            <p>No heart records found yet.</p>
          ) : (
            records.map((rec) => {
              const formattedDate = new Date(rec.createdTs).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "2-digit",
              });

              const preventionDate = rec.lastDirofilariaPreventionDate
                ? new Date(rec.lastDirofilariaPreventionDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "2-digit",
                  })
                : "—";

              return (
                <div key={rec.heartId} className="record-card">
                  <div className="record-info">
                    <div className="record-date">
                      <FaCalendarAlt className="calendar-icon" />
                      <span>{formattedDate}</span>
                    </div>

                    <div className="heart-details">
                      <p><strong>Status:</strong> {rec.status === "green" ? "🟢" : rec.status === "yellow" ? "🟡" : "🔴"}</p>
                      <p><strong>Fatigue:</strong> {rec.fatigue ? "YES" : "NO"}</p>
                      <p><strong>Coughing:</strong> {rec.coughing ? "YES" : "NO"}</p>
                      <p><strong>Murmurs:</strong> {rec.murmurStatus}</p>
                      <p><strong>Heart rate:</strong> {rec.heartRate} bpm</p>
                      <p><strong>Breathing rate:</strong> {rec.breathingRate} rpm</p>
                      <p><strong>Dirofilaria prevention:</strong> {preventionDate}</p>
                    </div>
                  </div>

                  <div className="record-actions">
                    <FaTrashAlt
                      className="action-icon delete-icon"
                      title="Delete record"
                      onClick={() => handleDelete(rec.heartId)}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="heart-highlights">
          <h2>Heart Highlights</h2>
          {highlights.length === 0 ? (
            <p>No heart highlights available.</p>
          ) : (
            highlights.map((h, idx) => (
              <div key={idx} className="highlight-card">
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
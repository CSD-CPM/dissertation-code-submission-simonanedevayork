import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCalendarAlt, FaTrashAlt } from "react-icons/fa";
import "../styles/Layout.css";
import "../styles/PageHeader.css";
import "../styles/Heart.css";
import { authFetch } from "../utils/apiClient";

export default function Dental() {
  const [records, setRecords] = useState([]);
  const [highlights, setHighlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDentalData = async () => {
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

        const dentalRecords = await authFetch(
          `http://localhost:8080/dogs/${dogId}/dental`,
          { method: "GET" },
          navigate
        );

        if (!dentalRecords) {
          setErrorMsg("Could not load dental data.");
          return;
        }

        setRecords(dentalRecords);
        setHighlights(dentalRecords[0]?.healthHighlights || []);
      } catch (err) {
        console.error("[Dental] Fetch failed:", err);
        setErrorMsg("Could not load dental data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDentalData();
  }, [navigate]);

  async function handleDelete(dentalId) {
    if (!window.confirm("Are you sure you want to delete this dental record?")) return;

    try {
      const dogId = localStorage.getItem("dogId");

      const res = await authFetch(
        `http://localhost:8080/dogs/${dogId}/dental/${dentalId}`,
        { method: "DELETE" },
        navigate
      );

      if (!res) {
        alert("❌ Failed to delete record.");
        return;
      }

      setRecords((prev) => prev.filter((r) => r.dentalId !== dentalId));
    } catch (err) {
      console.error("[Delete] Failed:", err);
      alert("❌ Failed to delete record.");
    }
  }

  if (loading) return <p>Loading dental records…</p>;
  if (errorMsg) return <p style={{ color: "red" }}>{errorMsg}</p>;

  return (
    <div className="page-container">

      <div className="page-header">
        <h1>Digital Dog Health Tracker<br />Dental Tracker</h1>
      </div>


      <div className="records-header">
        <div className="records-controls">
          <span className="record-count">
            {records.length} {records.length === 1 ? "record" : "records"}
          </span>
          <button className="add-new" onClick={() => navigate("/dental/add")}>
            Add New
          </button>
        </div>
      </div>


      <div className="heart-bottom">

        <div className="heart-records">
          <h2>Dental Records</h2>

          {records.length === 0 ? (
            <p>No dental records found yet.</p>
          ) : (
            records.map((rec) => {
              const formattedDate = new Date(rec.createdTs).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "2-digit",
              });

              const cleaningDate = rec.lastCleaningDate
                ? new Date(rec.lastCleaningDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "2-digit",
                  })
                : "—";

              return (
                <div key={rec.dentalId} className="record-card">
                  <div className="record-info">
                    <div className="record-date">
                      <FaCalendarAlt className="calendar-icon" />
                      <span>{formattedDate}</span>
                    </div>

                    <div className="heart-details">
                      <p>
                        <strong>Status:</strong>{" "}
                        {rec.status === "green"
                          ? "🟢"
                          : rec.status === "yellow"
                          ? "🟡"
                          : "🔴"}
                      </p>
                      <p><strong>Plaque:</strong> {rec.plaqueStatus}</p>
                      <p><strong>Tooth Loss:</strong> {rec.toothLoss ? "YES" : "NO"}</p>
                      <p><strong>Gingivitis:</strong> {rec.gingivitisStatus}</p>
                      <p><strong>Last Cleaning:</strong> {cleaningDate}</p>
                    </div>
                  </div>

                  <div className="record-actions">
                    <FaTrashAlt
                      className="action-icon delete-icon"
                      title="Delete record"
                      onClick={() => handleDelete(rec.dentalId)}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="heart-highlights">
          <h2>Dental Highlights</h2>
          {highlights.length === 0 ? (
            <p>No dental highlights available.</p>
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
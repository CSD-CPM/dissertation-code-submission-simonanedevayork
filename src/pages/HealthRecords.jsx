import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCalendarAlt, FaDownload, FaTrashAlt } from "react-icons/fa";
import "../styles/Layout.css";
import "../styles/PageHeader.css";
import "../styles/HealthRecords.css";
import { authFetch, authFetchFile } from "../utils/apiClient";

export default function HealthRecords() {
  const navigate = useNavigate();

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    const fetchHealthRecords = async () => {
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

          if (!dogData || !dogData.dogId) {
            setErrorMsg("No dog found for this user.");
            setLoading(false);
            return;
          }

          dogId = dogData.dogId;
          localStorage.setItem("dogId", dogId);
        }

        // Step 2: Fetch health records
        const data = await authFetch(
          `http://localhost:8080/dogs/${dogId}/health-records`,
          { method: "GET" },
          navigate
        );

        if (!data) {
          setErrorMsg("Could not load health records.");
          return;
        }

        setRecords(data);
      } catch (err) {
        console.error("[HealthRecords] Fetch failed:", err);
        setErrorMsg("Could not load health records.");
      } finally {
        setLoading(false);
      }
    };

    fetchHealthRecords();
  }, [navigate]);

  async function handleDownload(recordId, documentName) {
    try {
      const dogId = localStorage.getItem("dogId");

      const res = await authFetchFile(
        `http://localhost:8080/dogs/${dogId}/health-records/${recordId}/download`,
        { method: "GET" },
        navigate
      );

      if (!res) {
        alert("❌ Failed to download file.");
        return;
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = documentName;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("[Download] Failed:", err);
      alert("❌ Failed to download file.");
    }
  }

  async function handleDelete(recordId) {
    if (!window.confirm("Are you sure you want to delete this record?")) return;

    try {
      const dogId = localStorage.getItem("dogId");

      const res = await authFetch(
        `http://localhost:8080/dogs/${dogId}/health-records/${recordId}`,
        { method: "DELETE" },
        navigate
      );

      if (!res) {
        alert("❌ Failed to delete record.");
        return;
      }

      setRecords((prev) => prev.filter((r) => r.healthRecordId !== recordId));
    } catch (err) {
      console.error("[Delete] Failed:", err);
      alert("❌ Failed to delete record.");
    }
  }

  if (loading) return <p>Loading health records…</p>;
  if (errorMsg) return <p style={{ color: "red" }}>{errorMsg}</p>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Digital Dog Health Tracker<br />Health Records</h1>
      </div>

      <div className="records-header">
        <div className="records-controls">
          <span className="record-count">
            {records.length} {records.length === 1 ? "record" : "records"}
          </span>
          <button className="add-new" onClick={() => navigate("/health-records/add")}>
            Add New
          </button>
        </div>
      </div>

      {records.length === 0 ? (
        <p>No health records found yet.</p>
      ) : (
        <div className="records-list">
          {records.map((rec) => {
            const date = new Date(rec.createdTs);
            const formatted = date.toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "2-digit",
            });

            return (
              <div key={rec.healthRecordId} className="record-card">
                <div
                  className="record-info"
                  onClick={() => handleDownload(rec.healthRecordId)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="record-date">
                    <FaCalendarAlt className="calendar-icon" />
                    <span>{formatted}</span>
                  </div>
                  <div className="record-name">
                    <strong>{rec.documentName}</strong>
                  </div>
                </div>

                <div className="record-actions">
                <FaDownload
  className="action-icon download-icon"
  title="Download"
  onClick={(e) => {
    e.stopPropagation();
    handleDownload(rec.healthRecordId, rec.documentName);
  }}
/>
<FaTrashAlt
  className="action-icon delete-icon"
  title="Delete"
  onClick={(e) => {
    e.stopPropagation();
    handleDelete(rec.healthRecordId);
  }}
/>
                </div>
                
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
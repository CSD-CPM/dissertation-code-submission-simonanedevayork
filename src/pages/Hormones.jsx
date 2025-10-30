import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Layout.css";
import "../styles/PageHeader.css";
import "../styles/Mobility.css";
import { hormoneStatusTexts } from "../data/hormoneStatusTexts";
import { authFetch } from "../utils/apiClient";

export default function Hormones() {
  const [hormoneData, setHormoneData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHormones = async () => {
      try {
        const data = await authFetch(
          "http://localhost:8080/hormones/status",
          { method: "GET" },
          navigate
        );

        if (!data) {
          setErrorMsg("Could not load hormone data.");
          return;
        }

        setHormoneData(data);
      } catch (err) {
        console.error("[Hormones] Fetch failed:", err);
        setErrorMsg("Could not load hormone data.");
      } finally {
        setLoading(false);
      }
    };

    fetchHormones();
  }, [navigate]);

  if (loading) return <p>Loading hormone tracker…</p>;
  if (errorMsg) return <p style={{ color: "red" }}>{errorMsg}</p>;
  if (!hormoneData) return null;

  const { healthHighlights = [] } = hormoneData;
  const categories = ["thyroid", "adrenal", "pancreatic"];

  const colorMap = {
    red: "🔴",
    yellow: "🟡",
    green: "🟢",
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>
          Digital Dog Health Tracker
          <br />
          Hormones Tracker
        </h1>
      </div>

      <div className="mobility-status-grid">
        {categories.map((dog) => {
          const status = hormoneData[dog];
          const isMissing = status === null || status === undefined;

          if (isMissing) {
            return (
              <div key={dog} className="mobility-card">
                <h3>{dog.charAt(0).toUpperCase() + dog.slice(1)}</h3>
                <p>
                  <strong>Status:</strong> —
                </p>
                <p>
                  <strong>Quiz not completed yet</strong>
                </p>
                <p className="mobility-tip">
                  <strong>Tip:</strong> Complete the hormone quiz to assess your
                  dog’s {dog} health.
                </p>
              </div>
            );
          }

          const info = hormoneStatusTexts[dog][status];

          return (
            <div key={dog} className="mobility-card">
              <h3>{dog.charAt(0).toUpperCase() + dog.slice(1)}</h3>
              <p>
                <strong>Status:</strong> {colorMap[status]}
              </p>
              <p>
                <strong>{info.title}</strong>
              </p>
              <p className="mobility-tip">
                <strong>Tip:</strong> {info.tip}
              </p>
            </div>
          );
        })}
      </div>

      <div className="mobility-bottom">
        <div className="mobility-quiz">
          <h2>The Hormone Quiz</h2>
          <div className="quiz-box" onClick={() => navigate("/hormones/quiz")}>
            <h1>START NOW</h1>
          </div>
        </div>

        <div className="mobility-highlights">
          <h2>Hormone Highlights</h2>
          {healthHighlights.length === 0 ? (
            <p>No hormone highlights available.</p>
          ) : (
            healthHighlights.map((h, idx) => (
              <div key={idx} className="highlight-card">
                <p>
                  <strong>{h.title}</strong>
                </p>
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
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Layout.css";
import "../styles/PageHeader.css";
import "../styles/Mobility.css";
import { mobilityStatusTexts } from "../data/mobilityStatusTexts";
import { authFetch } from "../utils/apiClient";

export default function Mobility() {
  const [mobilityData, setMobilityData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMobility = async () => {
      try {
        const data = await authFetch(
          "http://localhost:8080/mobility/status",
          { method: "GET" },
          navigate
        );

        if (!data) {
          setErrorMsg("Could not load mobility data.");
          return;
        }

        setMobilityData(data);
      } catch (err) {
        console.error("[Mobility] Fetch failed:", err);
        setErrorMsg("Could not load mobility data.");
      } finally {
        setLoading(false);
      }
    };

    fetchMobility();
  }, [navigate]);

  if (loading) return <p>Loading mobility tracker…</p>;
  if (errorMsg) return <p style={{ color: "red" }}>{errorMsg}</p>;
  if (!mobilityData) return null;

  const { healthHighlights = [] } = mobilityData;
  const categories = ["patellar luxation", "hip dysplasia", "arthritis"];

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
          Mobility Tracker
        </h1>
      </div>

      <div className="mobility-status-grid">
        {categories.map((cat) => {
          const status = mobilityData[cat];
          const isMissing = status === null || status === undefined;

          if (isMissing) {
            return (
              <div key={cat} className="mobility-card">
                <h3>{cat.charAt(0).toUpperCase() + cat.slice(1)}</h3>
                <p>
                  <strong>Status:</strong> —
                </p>
                <p>
                  <strong>Quiz not completed yet</strong>
                </p>
                <p className="mobility-tip">
                  <strong>Tip:</strong> Complete the mobility quiz to assess your
                  dog’s {cat} health.
                </p>
              </div>
            );
          }

          const info = mobilityStatusTexts[cat][status];

          return (
            <div key={cat} className="mobility-card">
              <h3>{cat.charAt(0).toUpperCase() + cat.slice(1)}</h3>
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
          <h2>The Mobility Quiz</h2>
          <div className="quiz-box" onClick={() => navigate("/mobility/quiz")}>
            <h1>START NOW</h1>
          </div>
        </div>

        <div className="mobility-highlights">
          <h2>Mobility Highlights</h2>
          {healthHighlights.length === 0 ? (
            <p>No mobility highlights available.</p>
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
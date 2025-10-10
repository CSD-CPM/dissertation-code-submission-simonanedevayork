import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceArea,
} from "recharts";
import "../styles/Layout.css";
import "../styles/PageHeader.css";
import "../styles/Weight.css";

export default function WeightTracker() {
  const navigate = useNavigate();
  const [weights, setWeights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    const fetchWeights = async () => {
      const token = localStorage.getItem("token");
      const tokenType = localStorage.getItem("tokenType") || "Bearer";
      const participantId = localStorage.getItem("participantId");

      if (!token || !participantId) {
        navigate("/login");
        return;
      }

      try {
        let dogId = localStorage.getItem("dogId");
        if (!dogId) {
          const dogRes = await fetch(`http://localhost:8080/users/${participantId}/dog`, {
            headers: {
              Authorization: `${tokenType} ${token}`,
              "Content-Type": "application/json",
            },
          });
          const dogData = await dogRes.json();
          dogId = dogData?.dogId;
          localStorage.setItem("dogId", dogId);
        }

        const res = await fetch(`http://localhost:8080/dogs/${dogId}/weights`, {
          headers: { Authorization: `${tokenType} ${token}` },
        });

        if (!res.ok) throw new Error(`Failed to fetch weights (${res.status})`);

        const data = await res.json();
        setWeights(data);
      } catch (err) {
        console.error("[WeightTracker] Fetch failed:", err);
        setErrorMsg("Could not load weight data.");
      } finally {
        setLoading(false);
      }
    };

    fetchWeights();
  }, [navigate]);

  if (loading) return <p>Loading weight data...</p>;
  if (errorMsg) return <p style={{ color: "red" }}>{errorMsg}</p>;
  if (weights.length === 0) return <p>No weight data available.</p>;

  const latest = weights[weights.length - 1];
  const { current, goalWeightRange, status, healthHighlights } = latest;
  const minGoal = goalWeightRange?.min || 0;
  const maxGoal = goalWeightRange?.max || 0;

  const chartData = [...weights]
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .map((w) => ({
      date: new Date(w.date).toLocaleDateString("en-US", { month: "short" }),
      weight: w.current,
    }));

  const colorMap = {
    red: "#dc2626",
    yellow: "#facc15",
    green: "#16a34a",
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>
          Digital Dog Health Tracker
          <br />
          Weight Tracker
        </h1>
      </div>

      <div className="weight-summary">
        <div className="weight-box">
          <h3>Current weight:</h3>
          <p className="weight-value" style={{ color: colorMap[status] }}>
            {current.toFixed(1)} kg
          </p>
        </div>
        <div className="weight-box">
          <h3>Goal weight:</h3>
          <p>
            {minGoal.toFixed(1)} kg - {maxGoal.toFixed(1)} kg
          </p>
        </div>
      </div>

      <div className="weight-bottom">
        <div className="weight-graph">
          <h2>Weight Graph</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <XAxis dataKey="date" />
              <YAxis domain={[0, "dataMax + 2"]} />
              <Tooltip />
              <ReferenceArea
                y1={minGoal}
                y2={maxGoal}
                fill="#d1fae5"
                fillOpacity={0.4}
              />
              <Line
                type="monotone"
                dataKey="weight"
                stroke="#000"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="weight-highlights">
          <h2>Weight Highlights</h2>
          {(!healthHighlights || healthHighlights.length === 0) ? (
            <p>No highlights available.</p>
          ) : (
            healthHighlights.map((h, idx) => (
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
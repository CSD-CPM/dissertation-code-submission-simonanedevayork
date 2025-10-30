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
import { authFetch } from "../utils/apiClient";

export default function WeightTracker() {
  const navigate = useNavigate();
  const [weights, setWeights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    const fetchWeights = async () => {
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

        const data = await authFetch(
          `http://localhost:8080/dogs/${dogId}/weights`,
          { method: "GET" },
          navigate
        );

        if (!data) {
          setErrorMsg("Could not load weight data.");
          return;
        }

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
  const { current, goalWeightRange, status } = latest;
  const minGoal = goalWeightRange?.min || 0;
  const maxGoal = goalWeightRange?.max || 0;

  const chartData = [...weights]
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .map((w) => ({
      date: new Date(w.date).toLocaleDateString("en-US", { month: "short" }),
      weight: w.current,
    }));

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>
          Digital Dog Health Tracker
          <br />
          Weight Tracker
        </h1>
      </div>

      <div className="records-header">
        <div className="records-controls">
          <span className="record-count">
            {weights.length} {weights.length === 1 ? "entry" : "entries"}
          </span>
          <button className="add-new" onClick={() => navigate("/weight/add")}>
            Add New
          </button>
        </div>
      </div>

      <div className="weight-status-grid">
        <div className="weight-card">
          <h3>Status</h3>
          <p>
            <strong>Status:</strong>{" "}
            {status === "green" ? "🟢" : status === "yellow" ? "🟡" : "🔴"}
          </p>
          <p>
            <strong>
              {status === "green"
                ? "Healthy"
                : status === "yellow"
                ? "Borderline"
                : "Out of Range"}
            </strong>
          </p>
          <p className="weight-tip">
            {status === "green"
              ? "Your dog’s body condition looks optimal."
              : status === "yellow"
              ? "Slight deviation — monitor feeding or activity."
              : "Your dog’s weight is outside the healthy range."}
          </p>
        </div>

        <div className="weight-card">
          <h3>Current Weight</h3>
          <p className="weight-value">{current.toFixed(1)} kg</p>
        </div>

        <div className="weight-card">
          <h3>Goal Range</h3>
          <p>
            <strong>
              {minGoal.toFixed(1)} kg – {maxGoal.toFixed(1)} kg
            </strong>
          </p>
        </div>
      </div>

      <div className="weight-bottom">
        {/* Left side: graph */}
        <div className="weight-graph-box">
          <h2>Weight Graph</h2>
          <div className="graph-container">
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
        </div>

        {/* Right side: weight entries (instead of highlights) */}
        <div className="weight-highlights">
          <h2>All Weight Records</h2>
          {weights.length === 0 ? (
            <p>No records available.</p>
          ) : (
            weights
              .slice()
              .sort((a, b) => new Date(b.date) - new Date(a.date))
              .map((record, idx) => (
                <div key={idx} className="highlight-card">
                  <p>
                    <strong>
                      {new Date(record.date).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </strong>
                  </p>
                  <p>
                    Weight: <strong>{record.current.toFixed(1)} kg</strong>
                  </p>
                  <p>
                    Status:{" "}
                    {record.status === "green"
                      ? "🟢 Healthy"
                      : record.status === "yellow"
                      ? "🟡 Borderline"
                      : "🔴 Out of Range"}
                  </p>
                  <p>
                    Goal:{" "}
                    {record.goalWeightRange
                      ? `${record.goalWeightRange.min.toFixed(
                          1
                        )} – ${record.goalWeightRange.max.toFixed(1)} kg`
                      : "—"}
                  </p>
                </div>
              ))
          )}
        </div>
      </div>
    </div>
  );
}
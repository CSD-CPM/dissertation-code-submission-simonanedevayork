import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Layout.css";
import "../styles/Dashboard.css";
import OnboardingModal from "./OnboardingModal";
import { authFetch } from "../utils/apiClient";

export default function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [dog, setDog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const [user, setUser] = useState(null);
  const [showOnboarding, setShowOnboarding] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const participantId = localStorage.getItem("participantId");
        if (!participantId) {
          navigate("/login");
          return;
        }

        const userResponse = await authFetch(
          `http://localhost:8080/users/${participantId}`,
          { method: "GET" },
          navigate
        );

        setUser(userResponse);

        if (
          !userResponse.onboardingCompleted ||
          !userResponse.consentGranted
        ) {
          setShowOnboarding(true);
        }
      } catch (err) {
        console.error("[User Fetch Error]:", err);
        navigate("/login");
      }
    };

    fetchUser();
  }, [navigate]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const participantId = localStorage.getItem("participantId");
        if (!participantId) {
          navigate("/login");
          return;
        }

        const data = await authFetch(
          `http://localhost:8080/users/${participantId}/dashboard`,
          { method: "GET" },
          navigate
        );

        const dogData = await authFetch(
          `http://localhost:8080/users/${participantId}/dog`,
          { method: "GET" },
          navigate
        );

        setDashboard(data);
        setDog(dogData);
      } catch (err) {
        console.error("[Dashboard Fetch Error]:", err);
        setErrorMsg("Could not load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  const handleOnboardingComplete = async (consentGranted) => {
    const participantId = localStorage.getItem("participantId");

    if (!consentGranted) {
      localStorage.clear();
      navigate("/login");
      return;
    }

    try {
      const response = await authFetch(
        `http://localhost:8080/users/${participantId}/onboarding`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            onboardingCompleted: true,
            consentGranted: true,
          }),
        },
        navigate
      );

      console.log("[Onboarding Updated]", response);
      setShowOnboarding(false);
      setUser(response);
    } catch (err) {
      console.error("[Onboarding Update Error]:", err);
    }
  };

  if (loading) return <p>Loading dashboard…</p>;
  if (errorMsg) return <p style={{ color: "red" }}>{errorMsg}</p>;
  if (!dashboard || !dog) return <p>No dashboard data available.</p>;

  const {
    currentWeight,
    hormonesStatus = {},
    mobilityStatus = {},
    totalDentalRecords = 0,
    totalHeartRecords = 0,
    totalHealthRecords = 0,
    healthHighlights = [],
  } = dashboard;

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
      {showOnboarding && (
  <OnboardingModal
    onClose={() => setShowOnboarding(false)}
    onConsent={async (consented) => {
      const participantId = localStorage.getItem("participantId");

      if (!consented) {
        localStorage.clear();
        navigate("/login");
        return;
      }

      try {
        const response = await authFetch(
          `http://localhost:8080/users/${participantId}/onboarding`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              participantId,
              onboardingCompleted: true,
              consentGranted: true,
            }),
          },
          navigate
        );

        if (response.ok || response.status === 200) {
          console.log("[Onboarding] Consent granted successfully");
          localStorage.setItem("pawwellOnboardingSeen", "true");
          setShowOnboarding(false);
        } else {
          console.error("[Onboarding] Failed to update consent:", response);
        }
      } catch (err) {
        console.error("[Onboarding] Error updating consent:", err);
      }
    }}
  />
)}

      <div className="dashboard-summary">
        <div className="welcome-section">
          <h3>Welcome, {dog.name}!</h3>
          {dog.photoUrl ? (
            <img src={dog.photoUrl} alt={dog.name} className="dog-photo-large" />
          ) : (
            <div className="dog-photo-placeholder">🐾</div>
          )}
        </div>

        <div className="stat-card small">
          <h4>Current Weight</h4>
          <p>{currentWeight ? `${currentWeight} kg` : "—"}</p>
        </div>
        <div className="stat-card small">
          <h4>Dental Records</h4>
          <p>{totalDentalRecords ?? 0}</p>
        </div>
        <div className="stat-card small">
          <h4>Heart Records</h4>
          <p>{totalHeartRecords ?? 0}</p>
        </div>
        <div className="stat-card small">
          <h4>Health Records</h4>
          <p>{totalHealthRecords ?? 0}</p>
        </div>
      </div>

      <div className="dashboard-lower">
        <div className="status-column">
          <div className="highlight-card">
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

          <div className="highlight-card">
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

        <div className="dashboard-highlights">
          <h2>Health Highlights</h2>
          {(!healthHighlights || healthHighlights.length === 0) ? (
            <p>No health highlights available.</p>
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
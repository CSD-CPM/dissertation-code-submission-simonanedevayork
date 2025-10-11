import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Layout.css";
import "../styles/PageHeader.css";
import "../components/Login.css";
import logo from "../assets/logo.svg";
import { authFetch, authFetchFile } from "../utils/apiClient";

export default function AddHealthRecord() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    documentName: "",
    file: null,
  });

  const [message, setMessage] = useState("");

  useEffect(() => {
    const participantId = localStorage.getItem("participantId");
    const token = localStorage.getItem("token");

    if (!token || !participantId) {
      navigate("/login");
      return;
    }
  }, [navigate]);

  function handleChange(e) {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("📄 Uploading health record...");

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
          setMessage("❌ No dog found for this user.");
          return;
        }

        dogId = dogData.dogId;
        localStorage.setItem("dogId", dogId);
      }

      const formDataToSend = new FormData();
      formDataToSend.append("documentName", formData.documentName);
      if (formData.file) formDataToSend.append("file", formData.file);

      const res = await authFetchFile(
        `http://localhost:8080/dogs/${dogId}/health-records`,
        {
          method: "POST",
          body: formDataToSend,
        },
        navigate
      );

      if (!res) {
        setMessage("❌ Upload failed.");
        return;
      }

      setMessage("✅ Health record added successfully!");
      setTimeout(() => navigate("/health-records"), 1500);
    } catch (err) {
      console.error("❌ Upload error:", err);
      setMessage("❌ Failed to upload record.");
    }
  }

  return (
    <div className="login-wrapper">
      <div className="login-left">
        <h1 className="login-title">Add Health Record</h1>

        <form className="login-form" onSubmit={handleSubmit}>
          <div>
            <label>Document Name</label>
            <input
              type="text"
              name="documentName"
              value={formData.documentName}
              onChange={handleChange}
              placeholder="Vaccination Record"
              required
            />
          </div>

          <div>
            <label>Upload PDF</label>
            <input
              type="file"
              name="file"
              accept="application/pdf"
              ref={fileInputRef}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit">Upload Record</button>

          <p
            className="forgot-password"
            onClick={() => navigate("/health-records")}
            style={{ cursor: "pointer" }}
          >
            ← Back to Records
          </p>

          {message && <p className="login-message">{message}</p>}
        </form>
      </div>

      <div className="login-right">
        <img src={logo} alt="PawWell logo" />
      </div>
    </div>
  );
}
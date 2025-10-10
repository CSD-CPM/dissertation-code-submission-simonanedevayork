import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Layout.css";
import "../styles/PageHeader.css";
import "../components/Login.css";
import logo from "../assets/logo.svg";

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
      const token = localStorage.getItem("token");
      const tokenType = localStorage.getItem("tokenType") || "Bearer";
      const participantId = localStorage.getItem("participantId");

      let dogId = localStorage.getItem("dogId");

      if (!dogId) {
        const dogRes = await fetch(`http://localhost:8080/users/${participantId}/dog`, {
          headers: { Authorization: `${tokenType} ${token}` },
        });
        const dogData = await dogRes.json();
        dogId = dogData?.dogId;
        localStorage.setItem("dogId", dogId);
      }

      const formDataToSend = new FormData();
      formDataToSend.append("documentName", formData.documentName);
      if (formData.file) formDataToSend.append("file", formData.file);

      const res = await fetch(`http://localhost:8080/dogs/${dogId}/health-records`, {
        method: "POST",
        headers: { Authorization: `${tokenType} ${token}` },
        body: formDataToSend,
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Upload failed: ${errText}`);
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
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../components/Login.css";
import logo from "../assets/logo.svg";
import { dogBreeds as breeds } from "../data/dogBreeds";

export default function CreateDog() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    birthDate: "",
    gender: "",
    breed: "",
    file: null,
    isNeutered: false,
  });

  const [message, setMessage] = useState("");
  const fileInputRef = useRef(null);

  function handleChange(e) {
    const { name, value, type, checked, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : type === "file"
          ? files[0]
          : value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("🐾 Creating dog profile...");

    try {
      const token = localStorage.getItem("token");
      const formDataToSend = new FormData();

      formDataToSend.append("name", formData.name);
      formDataToSend.append("birthDate", formData.birthDate);
      formDataToSend.append("gender", formData.gender);
      formDataToSend.append("breed", formData.breed);
      formDataToSend.append("isNeutered", formData.isNeutered.toString());
      if (formData.file) {
        formDataToSend.append("file", formData.file);
      }

      const response = await fetch("http://localhost:8080/dogs", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      if (response.ok) {
        const result = await response.json();
        console.log("✅ Dog created:", result);
        setMessage("✅ Dog registered successfully!");
        setTimeout(() => navigate("/dashboard"), 1500);
      } else {
        const error = await response.text();
        console.error("❌ Failed:", error);
        setMessage("❌ Failed to register dog.");
      }
    } catch (err) {
      console.error("❌ Error:", err);
      setMessage("❌ Something went wrong.");
    }
  }

  return (
    <div className="login-wrapper">
      <div className="login-left">
        <h1 className="login-title">Register your dog</h1>

        <form className="login-form" onSubmit={handleSubmit}>
          <div>
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Value"
              required
            />
          </div>

          <div>
            <label>Date of birth</label>
            <input
              type="date"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label>Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
            >
              <option value="">Select gender</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
            </select>
          </div>

          <div>
            <label>Breed</label>
            <select
              name="breed"
              value={formData.breed}
              onChange={handleChange}
              required
            >
              <option value="">Select breed</option>
              {breeds.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>Upload Photo (optional)</label>
            <input
              type="file"
              name="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="isNeutered"
                checked={formData.isNeutered}
                onChange={handleChange}
              />
              Is neutered?
            </label>
          </div>

          <button type="submit">Create Dog</button>

          <p
            className="forgot-password"
            onClick={() => navigate("/login")}
            style={{ cursor: "pointer" }}
          >
            ← Back to Login
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
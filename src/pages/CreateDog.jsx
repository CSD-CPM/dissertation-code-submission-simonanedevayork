import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../components/Login.css";
import logo from "../assets/logo.svg";

export default function CreateDog() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    birthDate: "",
    gender: "",
    breed: "",
    photoUrl: "",
    isNeutered: false,
  });
  const [message, setMessage] = useState("");

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("🐾 Creating dog profile...");

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8080/dogs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
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
      {/* Left side - form */}
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
            <input
              type="text"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              placeholder="Value"
              required
            />
          </div>

          <div>
            <label>Breed</label>
            <input
              type="text"
              name="breed"
              value={formData.breed}
              onChange={handleChange}
              placeholder="Value"
              required
            />
          </div>

          <div>
            <label>Photo URL (optional)</label>
            <input
              type="text"
              name="photoUrl"
              value={formData.photoUrl}
              onChange={handleChange}
              placeholder="https://..."
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

      {/* Right side - logo */}
      <div className="login-right">
        <img src={logo} alt="PawWell logo" />
      </div>
    </div>
  );
}

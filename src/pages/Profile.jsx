import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Layout.css";
import "../styles/PageHeader.css";
import "../components/Login.css";
import { dogBreeds as breeds } from "../data/dogBreeds";
import { authFetch } from "../utils/apiClient";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ email: "", password: "" });
  const [dog, setDog] = useState({
    name: "",
    birthDate: "",
    gender: "",
    breed: "",
    isNeutered: false,
    file: null,
  });
  const [message, setMessage] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const participantId = localStorage.getItem("participantId");
        if (!participantId) return navigate("/login");

        const userData = await authFetch(
          `http://localhost:8080/users/${participantId}`,
          { method: "GET" },
          navigate
        );
        if (userData) setUser({ email: userData.email, password: "" });

        let dogId = localStorage.getItem("dogId");
        if (!dogId) {
          const dogData = await authFetch(
            `http://localhost:8080/users/${participantId}/dog`,
            { method: "GET" },
            navigate
          );
          if (dogData?.dogId) {
            dogId = dogData.dogId;
            localStorage.setItem("dogId", dogId);
          }
        }

        if (dogId) {
          const dogData = await authFetch(
            `http://localhost:8080/dogs/${dogId}`,
            { method: "GET" },
            navigate
          );
          if (dogData) {
            setDog({
              name: dogData.name || "",
              birthDate: dogData.birthDate || "",
              gender: dogData.gender || "",
              breed: dogData.breed || "",
              isNeutered: dogData.isNeutered || false,
              file: null,
            });
          }
        }
      } catch (err) {
        console.error("[Profile] Data load failed:", err);
      }
    };
    loadData();
  }, [navigate]);

  function handleUserChange(e) {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  }

  function handleDogChange(e) {
    const { name, value, type, checked, files } = e.target;
    setDog((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : type === "file" ? files[0] : value,
    }));
  }

  async function handleUserUpdate(e) {
    e.preventDefault();
    const participantId = localStorage.getItem("participantId");
    if (!participantId) return navigate("/login");

    if (!user.password) {
      setMessage("❌ Please enter your password to update profile.");
      return;
    }

    const body = {
      email: user.email,
      password: user.password,
    };

    const res = await authFetch(
      `http://localhost:8080/users/${participantId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      },
      navigate
    );

    if (res) {
      setMessage("✅ Profile updated successfully!");
      setTimeout(() => navigate("/dashboard"), 1500);
    } else setMessage("❌ Failed to update profile.");
  }

  async function handleDogUpdate(e) {
    e.preventDefault();
    const dogId = localStorage.getItem("dogId");
    if (!dogId) return setMessage("❌ No dog found.");

    const formData = new FormData();
    formData.append("name", dog.name);
    formData.append("birthDate", dog.birthDate);
    formData.append("gender", dog.gender);
    formData.append("breed", dog.breed);
    formData.append("isNeutered", dog.isNeutered.toString());
    if (dog.file) formData.append("file", dog.file);

    try {
      const res = await fetch(`http://localhost:8080/dogs/${dogId}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: formData,
      });

      if (res.ok) {
        setMessage("✅ Dog profile updated successfully!");
        setTimeout(() => navigate("/dashboard"), 1500);
      } else {
        setMessage("❌ Failed to update dog profile.");
      }
    } catch (err) {
      console.error("❌ Dog update failed:", err);
      setMessage("❌ Something went wrong.");
    }
  }

  function handleLogout() {
    localStorage.clear();
    navigate("/login");
  }

  return (
    <div className="page-container">
      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Digital Dog Health Tracker<br />Profile Settings</h1>
        <button
          onClick={handleLogout}
          style={{
            background: "#2c2c2c",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            fontSize: "15px",
            padding: "10px 20px",
            cursor: "pointer",
            height: "fit-content"
          }}
        >
          Logout
        </button>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          gap: "40px",
          flexWrap: "wrap",
          marginTop: "40px",
          maxWidth: "1000px",
          marginInline: "auto",
        }}
      >
        <form
          className="login-form"
          onSubmit={handleUserUpdate}
          style={{ flex: "1 1 400px", maxWidth: "450px" }}
        >
          <h3>Edit User Account</h3>
          <div>
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={handleUserChange}
              required
            />
          </div>
          <div>
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={user.password}
              onChange={handleUserChange}
              placeholder="Enter your password"
              required
            />
          </div>
          <button type="submit">Update Profile</button>
        </form>

        <form
          className="login-form"
          onSubmit={handleDogUpdate}
          style={{ flex: "1 1 400px", maxWidth: "450px" }}
        >
          <h3>Edit Dog Profile</h3>
          <div>
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={dog.name}
              onChange={handleDogChange}
              required
            />
          </div>
          <div>
            <label>Date of Birth</label>
            <input
              type="date"
              name="birthDate"
              value={dog.birthDate}
              onChange={handleDogChange}
            />
          </div>
          <div>
            <label>Gender</label>
            <select
              name="gender"
              value={dog.gender}
              onChange={handleDogChange}
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
              value={dog.breed}
              onChange={handleDogChange}
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
            <label>Upload Photo</label>
            <input
              type="file"
              name="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleDogChange}
            />
          </div>
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="isNeutered"
              checked={dog.isNeutered}
              onChange={handleDogChange}
            />
            Is neutered?
          </label>
          <button type="submit">Update Dog</button>
        </form>
      </div>

      {message && (
        <p className="login-message" style={{ marginTop: "30px" }}>
          {message}
        </p>
      )}
    </div>
  );
}
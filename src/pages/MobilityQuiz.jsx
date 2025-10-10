import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Layout.css";
import "../styles/PageHeader.css";
import "../styles/MobilityQuiz.css";

export default function MobilityQuiz() {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestions = async () => {
      const token = localStorage.getItem("token");
      const tokenType = localStorage.getItem("tokenType") || "Bearer";

      try {
        const res = await fetch("http://localhost:8080/mobility/quiz", {
          headers: { Authorization: `${tokenType} ${token}` },
        });

        if (!res.ok) throw new Error(`Server error ${res.status}`);
        const data = await res.json();
        setQuestions(data);
      } catch (err) {
        console.error("[MobilityQuiz] Failed:", err);
        setMessage("❌ Could not load quiz.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  if (loading) return <p>Loading quiz...</p>;
  if (message) return <p>{message}</p>;
  if (questions.length === 0) return <p>No quiz data.</p>;

  const currentQuestion = questions[currentIndex];
  const total = questions.length;

  function handleAnswer(option) {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: option,
    }));
  }

  async function handleSubmit() {
    if (Object.keys(answers).length < total) {
      alert("Please answer all questions before submitting.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const tokenType = localStorage.getItem("tokenType") || "Bearer";

      const res = await fetch("http://localhost:8080/mobility/quiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${tokenType} ${token}`,
        },
        body: JSON.stringify(answers),
      });

      if (!res.ok) throw new Error(`Submit failed (${res.status})`);

      setMessage("✅ Quiz submitted successfully!");
      setTimeout(() => navigate("/mobility"), 1500);
    } catch (err) {
      console.error("[MobilityQuiz] Submit failed:", err);
      alert("❌ Failed to submit quiz.");
    }
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>
          Digital Dog Health Tracker<br />
          Mobility Quiz
        </h1>
      </div>

      <div className="quiz-wrapper">

        <h3 className="quiz-question">{currentQuestion.question}</h3>

        <div className="quiz-options">
          {currentQuestion.options.map((opt) => (
            <div
              key={opt}
              className={`quiz-option ${
                answers[currentQuestion.id] === opt ? "selected" : ""
              }`}
              onClick={() => handleAnswer(opt)}
            >
              {opt}
            </div>
          ))}
        </div>

        <div className="quiz-nav">
          <button
            onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
            disabled={currentIndex === 0}
          >
            ◀
          </button>

          <span>
            {currentIndex + 1} / {total}
          </span>

          <button
            onClick={() => setCurrentIndex((i) => Math.min(total - 1, i + 1))}
            disabled={currentIndex === total - 1}
          >
            ▶
          </button>
        </div>

<div className="quiz-progress">
  <p className="quiz-progress-label">
    Question {currentIndex + 1} of {total}
  </p>
  <div className="quiz-progress-bar">
    <div
      className="quiz-progress-fill"
      style={{ width: `${((currentIndex + 1) / total) * 100}%` }}
    />
  </div>
</div>


{currentIndex === total - 1 && (
          <button className="quiz-submit" onClick={handleSubmit}>
            SUBMIT
          </button>
        )}

      </div>

    </div>
  );
}
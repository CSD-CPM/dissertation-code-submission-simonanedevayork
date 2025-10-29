import React, { useState } from "react";
import "../styles/OnboardingModal.css";
import logo from "../assets/logo.svg";

export default function OnboardingModal({ onClose }) {
  const slides = [
    {
      title: "Welcome to PawWell 🐾",
      text: "Your digital dog health tracker! Let’s take a quick tour so you know where everything is.",
    },
    {
      title: "Dashboard Overview",
      text: "See your dog’s latest health stats, records, and personalized highlights — all in one place.",
    },
    {
      title: "Track Weight & Hormones",
      text: "Monitor changes over time and ensure your dog stays in a healthy range.",
    },
    {
      title: "Dental & Heart Records",
      text: "Log checkups, cleanings, or conditions — PawWell visualizes progress for better awareness.",
    },
    {
      title: "Mobility & Health Insights",
      text: "Run quick quizzes to detect early signs of discomfort and get actionable recommendations.",
    },
  ];

  const [step, setStep] = useState(0);

  const handleNext = () => {
    if (step < slides.length - 1) setStep(step + 1);
    else handleFinish();
  };

  const handleFinish = () => {
    localStorage.setItem("pawwellOnboardingSeen", "true");
    onClose();
  };

  return (
    <div className="onboarding-overlay">
      <div className="onboarding-modal">
        <img src={logo} alt="PawWell Logo" className="onboarding-logo" />
        <h2>{slides[step].title}</h2>
        <p>{slides[step].text}</p>

        <div className="onboarding-dots">
          {slides.map((_, i) => (
            <span key={i} className={i === step ? "dot active" : "dot"}></span>
          ))}
        </div>

        <div className="onboarding-actions">
          <button className="skip" onClick={handleFinish}>
            Skip
          </button>
          <button className="next" onClick={handleNext}>
            {step === slides.length - 1 ? "Finish" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}
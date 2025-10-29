import React, { useState } from "react";
import "../styles/OnboardingModal.css";
import logo from "../assets/logo.svg";

export default function OnboardingModal({ onClose, onConsent }) {
  const slides = [
    {
      title: "Welcome to PawWell 🐾",
      text: "Your digital dog health tracker! Let’s take a quick tour so you know where everything is.",
      isWelcome: true,
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
    {
      title: "Consent & Data Use",
      text: (
        <>
          PawWell securely stores your dog’s health information to provide personalized insights and visualizations.  
          <br /><br />
          No personal data is shared externally, and all information remains private within your account.  
          <br /><br />
          To continue using the system, you must grant consent for data processing.  
          <strong> If you decline, you will be logged out and unable to access the system.</strong>
        </>
      ),
      isConsent: true,
    },
  ];

  const [step, setStep] = useState(0);

  const handleNext = () => {
    if (step < slides.length - 1) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleJumpToConsent = () => {
    setStep(slides.length - 1);
  };

  const handleAgree = () => {
    onConsent(true);
  };

  const handleDecline = () => {
    onConsent(false);
  };

  return (
    <div className="onboarding-overlay">
      <div className="onboarding-modal">
        <img src={logo} alt="PawWell Logo" className="onboarding-logo" />

        <h2>{slides[step].title}</h2>
        <p className="onboarding-text">{slides[step].text}</p>

        <div className="onboarding-dots">
          {slides.map((_, i) => (
            <span
              key={i}
              className={i === step ? "dot active" : "dot"}
              onClick={() => setStep(i)}
              style={{ cursor: "pointer" }}
            ></span>
          ))}
        </div>

        <div className="onboarding-actions">
          {slides[step].isWelcome ? (
            <>
              <button className="jump" onClick={handleJumpToConsent}>
                Skip to Consent
              </button>
              <button className="next" onClick={handleNext}>
                Next
              </button>
            </>
          ) : slides[step].isConsent ? (
            <div className="consent-buttons">
              <button className="decline" onClick={handleDecline}>
                Decline
              </button>
              <button className="agree" onClick={handleAgree}>
                I Agree
              </button>
            </div>
          ) : (
            <>
              {step > 0 && (
                <button className="back" onClick={handlePrev}>
                  Back
                </button>
              )}
              <button className="next" onClick={handleNext}>
                Next
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
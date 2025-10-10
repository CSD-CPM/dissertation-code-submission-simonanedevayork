import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ResetPassword from "./pages/ResetPassword";
import ResetPasswordConfirm from "./pages/ResetPasswordConfirm";
import CreateDog from "./pages/CreateDog";
import HealthRecords from "./pages/HealthRecords";
import AddHealthRecord from "./pages/AddHealthRecord";
import Mobility from "./pages/Mobility";
import MobilityQuiz from "./pages/MobilityQuiz";
import Weight from "./pages/Weight";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ResetPassword />} />
        <Route path="/reset-password" element={<ResetPasswordConfirm />} />
        <Route path="create-dog" element={<CreateDog />} />

        {/* Protected pages (with Layout) */}
        <Route
          path="/*"
          element={
            <Layout>
              <Routes>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="hormones" element={<div>Hormones page</div>} />
                <Route path="dental" element={<div>Dental page</div>} />
                <Route path="heart" element={<div>Heart page</div>} />
                <Route path="mobility" element={<Mobility />} />
                <Route path="health-records" element={<HealthRecords />} />
                <Route path="profile" element={<div>Profile page</div>} />
                <Route path="health-records/add" element={<AddHealthRecord />} />
                <Route path="mobility/quiz" element={<MobilityQuiz />} />
                <Route path="weight" element={<Weight />} />
              </Routes>
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
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
import AddWeightRecord from "./pages/AddWeightRecord";
import Hormones from "./pages/Hormones";
import HormonesQuiz from "./pages/HormonesQuiz";
import Heart from "./pages/Heart";
import AddHeartRecord from "./pages/AddHeartRecord";
import Dental from "./pages/Dental";
import AddDentalRecord from "./pages/AddDentalRecord";
import Register from "./pages/Register";
import Profile from "./pages/Profile";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ResetPassword />} />
        <Route path="/reset-password" element={<ResetPasswordConfirm />} />
        <Route path="/register" element={<Register />} />
        <Route path="create-dog" element={<CreateDog />} />

        {/* Protected pages (with Layout) */}
        <Route
          path="/*"
          element={
            <Layout>
              <Routes>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="/hormones" element={<Hormones />} />
                <Route path="/heart" element={<Heart />} />
                <Route path="/heart/add" element={<AddHeartRecord />} />
                <Route path="mobility" element={<Mobility />} />
                <Route path="health-records" element={<HealthRecords />} />
                <Route path="health-records/add" element={<AddHealthRecord />} />
                <Route path="mobility/quiz" element={<MobilityQuiz />} />
                <Route path="weight" element={<Weight />} />
                <Route path="/weight/add" element={<AddWeightRecord />} />
                <Route path="dental" element={<Dental />} />
                <Route path="/dental/add" element={<AddDentalRecord />} />
                <Route path="/hormones/quiz" element={<HormonesQuiz />} />
                <Route path="profile" element={<Profile />} />
              </Routes>
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ResetPassword from "./pages/ResetPassword";
import ResetPasswordConfirm from "./pages/ResetPasswordConfirm";
import CreateDog from "./pages/CreateDog";
import HealthRecords from "./pages/HealthRecords";

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
                <Route path="weight" element={<div>Weight page</div>} />
                <Route path="hormones" element={<div>Hormones page</div>} />
                <Route path="dental" element={<div>Dental page</div>} />
                <Route path="heart" element={<div>Heart page</div>} />
                <Route path="mobility" element={<div>Mobility page</div>} />
                <Route path="health-records" element={<HealthRecords />} />
                <Route path="profile" element={<div>Profile page</div>} />
              </Routes>
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
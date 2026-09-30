import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import GetStarted from "./pages/GetStarted";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Onboarding from "./pages/onboarding/Onboarding";
import CandidateLayout from "./pages/candidate/CandidateLayout";
import Dashboard from "./pages/candidate/Dashboard";
import Jobs from "./pages/candidate/Jobs";
import JobDetails from "./pages/candidate/JobDetails";
import Applications from "./pages/candidate/Applications";
import Messages from "./pages/candidate/Messages";
import Profile from "./pages/candidate/Profile";
import { CandidateProvider } from "./context/CandidateContext";
import EmployerLayout from "./pages/employer/EmployerLayout";
import CompanySetup from "./pages/employer/CompanySetup";
import EmployerDashboard from "./pages/employer/EmployerDashboard";
import EmployerProfile from "./pages/employer/Profile";
import CreateJob from "./pages/employer/CreateJob";
import JobsList from "./pages/employer/JobsList";
import JobPipeline from "./pages/employer/JobPipeline";
import CandidateDetail from "./pages/employer/CandidateDetail";
import Candidates from "./pages/employer/Candidates";
import Analytics from "./pages/employer/Analytics";
import { EmployerProvider } from "./context/EmployerContext";
import { LanguageProvider } from "./context/LanguageContext";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

function HomeLayout() {
  return (
    <>
      <Navbar variant="full" />
      <Home />
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <CandidateProvider>
          <EmployerProvider>
            <Routes>
              <Route path="/" element={<HomeLayout />} />
              <Route path="/get-started" element={<GetStarted />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/employer/setup" element={<CompanySetup />} />

              <Route
                path="/candidate"
                element={
                  <ProtectedRoute role="candidate">
                    <CandidateLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Dashboard />} />
                <Route path="jobs" element={<Jobs />} />
                <Route path="jobs/:id" element={<JobDetails />} />
                <Route path="applications" element={<Applications />} />
                <Route path="messages" element={<Messages />} />
                <Route path="profile" element={<Profile />} />
              </Route>

              <Route
                path="/employer"
                element={
                  <ProtectedRoute role="employer">
                    <EmployerLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<EmployerDashboard />} />
                <Route path="jobs" element={<JobsList />} />
                <Route path="jobs/new" element={<CreateJob />} />
                <Route path="jobs/:jobId" element={<JobPipeline />} />
                <Route path="jobs/:jobId/candidates/:candidateId" element={<CandidateDetail />} />
                <Route path="candidates" element={<Candidates />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="profile" element={<EmployerProfile />} />
              </Route>
            </Routes>
          </EmployerProvider>
        </CandidateProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
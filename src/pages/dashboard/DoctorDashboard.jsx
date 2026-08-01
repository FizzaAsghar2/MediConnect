import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Features from "./components/Features";
import Footer from "./components/Footer";

import DoctorLogin from "./pages/auth/DoctorLogin";
import DoctorRegister from "./pages/auth/DoctorRegister";
import PatientLogin from "./pages/auth/PatientLogin";
import PatientRegister from "./pages/auth/PatientRegister";

import Doctors from "./pages/Doctors";
import BookAppointment from "./pages/BookAppointment";

import DoctorDashboard from "./pages/dashboard/DoctorDashboard";
import DoctorProfile from "./pages/dashboard/DoctorProfile";
import PatientDashboard from "./pages/dashboard/PatientDashboard";

import DoctorList from "./pages/dashboard/DoctorList";
import Appointments from "./pages/dashboard/Appointments";
import DoctorAppointments from "./pages/dashboard/DoctorAppointments";

import ProtectedRoute from "./components/protected/ProtectedRoute";

function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Features />
      <Footer />
    </>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      {/* Public Pages */}
      <Route path="/doctors" element={<Doctors />} />
      <Route path="/book-appointment" element={<BookAppointment />} />

      {/* Authentication */}
      <Route path="/doctor/login" element={<DoctorLogin />} />
      <Route path="/doctor/register" element={<DoctorRegister />} />
      <Route path="/patient/login" element={<PatientLogin />} />
      <Route path="/patient/register" element={<PatientRegister />} />

      {/* Doctor Dashboard */}
      <Route
        path="/doctor/dashboard"
        element={
          <ProtectedRoute>
            <DoctorDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/doctor/profile"
        element={
          <ProtectedRoute>
            <DoctorProfile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/doctor/appointments"
        element={
          <ProtectedRoute>
            <DoctorAppointments />
          </ProtectedRoute>
        }
      />

      {/* Patient Dashboard */}
      <Route
        path="/patient/dashboard"
        element={
          <ProtectedRoute>
            <PatientDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/appointments"
        element={
          <ProtectedRoute>
            <Appointments />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/doctors"
        element={
          <ProtectedRoute>
            <DoctorList />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import DashboardCard from "../../components/dashboard/DashboardCard";
import useProfile from "../../hooks/useProfile";

import {
  FaCalendarCheck,
  FaUserMd,
  FaClock,
} from "react-icons/fa";

function PatientDashboard() {
  const { profile, loading } = useProfile("patient");

  if (loading) {
    return (
      <DashboardLayout>
        <h2>Loading Dashboard...</h2>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <h1>Welcome, {profile?.full_name}</h1>

      <div className="dashboard-cards">
        <DashboardCard
          title="Appointments"
          value="0"
          icon={<FaCalendarCheck />}
        />

        <DashboardCard
          title="Doctors"
          value="0"
          icon={<FaUserMd />}
        />

        <DashboardCard
          title="Pending"
          value="0"
          icon={<FaClock />}
        />
      </div>

      <div className="profile-card">
        <h3>Profile Information</h3>

        <p><strong>Name:</strong> {profile?.full_name}</p>
        <p><strong>Email:</strong> {profile?.email}</p>
        <p><strong>Age:</strong> {profile?.age}</p>
        <p><strong>Gender:</strong> {profile?.gender}</p>
      </div>
    </DashboardLayout>
  );
}

export default PatientDashboard;
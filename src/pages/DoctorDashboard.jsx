import DashboardLayout from "../../components/dashboard/DashboardLayout";
import useProfile from "../../hooks/useProfile";
import DashboardCard from "../../components/dashboard/DashboardCard";
import {
  FaCalendarCheck,
  FaUserInjured,
  FaClock,
} from "react-icons/fa";

function DoctorDashboard() {
  const { profile, loading } = useProfile("doctor");

  if (loading) {
    return <h2>Loading...</h2>;
  }

  return (
    <DashboardLayout>
      <h1>Welcome, Dr. {profile?.full_name}</h1>

      <div className="dashboard-cards">
        <DashboardCard
          title="Appointments"
          value="0"
          icon={<FaCalendarCheck />}
        />

        <DashboardCard
          title="Patients"
          value="0"
          icon={<FaUserInjured />}
        />

        <DashboardCard
          title="Pending"
          value="0"
          icon={<FaClock />}
        />
      </div>

      <div className="profile-card">
        <p><strong>Email:</strong> {profile?.email}</p>
        <p><strong>Specialty:</strong> {profile?.specialty}</p>
      </div>
    </DashboardLayout>
  );
}

export default DoctorDashboard;
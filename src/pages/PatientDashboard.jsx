import DashboardLayout from "../../components/dashboard/DashboardLayout";
import useProfile from "../../hooks/useProfile";
import DashboardCard from "../../components/dashboard/DashboardCard";
import {
  FaCalendarCheck,
  FaUserMd,
  FaClock,
} from "react-icons/fa";

function PatientDashboard() {
  const { profile, loading } = useProfile("patient");

  if (loading) {
    return <h2>Loading...</h2>;
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
        <p><strong>Email:</strong> {profile?.email}</p>
        <p><strong>Age:</strong> {profile?.age}</p>
        <p><strong>Gender:</strong> {profile?.gender}</p>
      </div>
    </DashboardLayout>
  );
}

export default PatientDashboard;
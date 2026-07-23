import { supabase } from "../../lib/supabase";
import { useNavigate } from "react-router-dom";

function DoctorDashboard() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <div style={{ padding: "40px" }}>
      <h1>Doctor Dashboard</h1>
      <p>Welcome Doctor!</p>

      <button onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}

export default DoctorDashboard;
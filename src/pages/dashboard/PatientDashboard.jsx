import { supabase } from "../../lib/supabase";
import { useNavigate } from "react-router-dom";

function PatientDashboard() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <div style={{ padding: "40px" }}>
      <h1>Patient Dashboard</h1>
      <p>Welcome Patient!</p>

      <button onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}

export default PatientDashboard;
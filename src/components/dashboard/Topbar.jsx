import { supabase } from "../../lib/supabase";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Topbar() {
  const navigate = useNavigate();
  const { user } = useAuth();

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate("/");
  }

  return (
    <header className="topbar">
      <h3>MediConnect Dashboard</h3>

      <div className="topbar-user">
        <p>{user?.email}</p>

        <button
          className="logout-btn"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </header>
  );
}

export default Topbar;
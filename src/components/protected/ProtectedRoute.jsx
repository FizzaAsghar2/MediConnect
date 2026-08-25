import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function ProtectedRoute({ children, role }) {
  const { user, role: userRole, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <h2>Loading...</h2>
      </div>
    );
  }

  if (!user) {
    return (
      <Navigate
        to={role === "patient" ? "/patient/login" : "/doctor/login"}
        replace
      />
    );
  }

  if (!userRole) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <h2>Profile not found</h2>
        <p>Please make sure your patient profile exists.</p>
      </div>
    );
  }

  if (role && userRole !== role) {
    return (
      <Navigate
        to={
          userRole === "doctor"
            ? "/doctor/dashboard"
            : "/patient/dashboard"
        }
        replace
      />
    );
  }

  return children;
}

export default ProtectedRoute;
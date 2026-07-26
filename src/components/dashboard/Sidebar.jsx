import { NavLink, useLocation } from "react-router-dom";
import {
  FaHome,
  FaUserMd,
  FaCalendarAlt,
} from "react-icons/fa";

function Sidebar() {
  const location = useLocation();

  const isDoctor = location.pathname.startsWith("/doctor");

  return (
    <aside className="sidebar">
      <h2 className="logo">MediConnect</h2>

      <nav>
        {isDoctor ? (
          <>
            <NavLink to="/doctor/dashboard">
              <FaHome />
              Dashboard
            </NavLink>

            <NavLink to="/doctor/appointments">
              <FaCalendarAlt />
              Appointments
            </NavLink>
          </>
        ) : (
          <>
            <NavLink to="/patient/dashboard">
              <FaHome />
              Dashboard
            </NavLink>

            <NavLink to="/doctors">
              <FaUserMd />
              Find Doctors
            </NavLink>

            <NavLink to="/appointments">
              <FaCalendarAlt />
              My Appointments
            </NavLink>
          </>
        )}
      </nav>
    </aside>
  );
}

export default Sidebar;
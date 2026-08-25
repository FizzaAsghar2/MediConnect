
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../context/AuthContext";
import DashboardLayout from "../../components/dashboard/DashboardLayout";

function Appointments() {
  const { user } = useAuth();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchAppointments();
    }
  }, [user]);

  async function fetchAppointments() {
    setLoading(true);

    const { data, error } = await supabase
      .from("appointments")
      .select(`
        *,
        doctors(
          full_name,
          specialty
        )
      `)
      .eq("patient_id", user.id)
      .order("appointment_date", { ascending: true });

    if (!error) {
      setAppointments(data || []);
    }

    setLoading(false);
  }

  async function cancelAppointment(id) {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this appointment?"
    );

    if (!confirmCancel) return;

    const { error } = await supabase
      .from("appointments")
      .update({
        status: "Cancelled",
      })
      .eq("id", id);

    if (!error) {
      fetchAppointments();
    }
  }

  function formatDate(date) {
    if (!date) return "Not available";

    return new Date(date).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  function formatTime(time) {
    if (!time) return "Not available";

    const [hours, minutes] = time.split(":");
    const date = new Date();

    date.setHours(hours, minutes);

    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  }

  return (
    <DashboardLayout>
      <div className="appointments-page">

        <div className="appointments-header">
          <div>
            <h1>My Appointments</h1>
            <p>View and manage your upcoming healthcare appointments.</p>
          </div>

          <div className="appointment-count">
            {appointments.length} Appointment
            {appointments.length !== 1 ? "s" : ""}
          </div>
        </div>

        {loading ? (
          <div className="appointment-empty">
            <div className="appointment-loader"></div>
            <p>Loading your appointments...</p>
          </div>
        ) : appointments.length === 0 ? (
          <div className="appointment-empty">
            <div className="empty-icon">📅</div>
            <h3>No Appointments Yet</h3>
            <p>
              You haven't booked any appointments with doctors yet.
            </p>
          </div>
        ) : (
          <div className="appointments-grid">
            {appointments.map((appointment) => (
              <div
                key={appointment.id}
                className="appointment-card"
              >
                <div className="appointment-card-header">
                  <div className="doctor-info">
                    <div className="doctor-avatar">
                      {appointment.doctors?.full_name
                        ?.charAt(0)
                        .toUpperCase() || "D"}
                    </div>

                    <div>
                      <h3>
                        Dr.{" "}
                        {appointment.doctors?.full_name ||
                          "Doctor"}
                      </h3>

                      <span>
                        {appointment.doctors?.specialty ||
                          "General Physician"}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`status ${appointment.status.toLowerCase()}`}
                  >
                    {appointment.status}
                  </span>
                </div>

                <div className="appointment-details">

                  <div className="appointment-detail">
                    <span className="detail-icon">📅</span>

                    <div>
                      <small>Date</small>
                      <strong>
                        {formatDate(
                          appointment.appointment_date
                        )}
                      </strong>
                    </div>
                  </div>

                  <div className="appointment-detail">
                    <span className="detail-icon">🕐</span>

                    <div>
                      <small>Time</small>
                      <strong>
                        {formatTime(
                          appointment.appointment_time
                        )}
                      </strong>
                    </div>
                  </div>

                </div>

                <div className="appointment-card-footer">

                  {appointment.status === "Pending" && (
                    <button
                      className="cancel-appointment-btn"
                      onClick={() =>
                        cancelAppointment(appointment.id)
                      }
                    >
                      Cancel Appointment
                    </button>
                  )}

                  {appointment.status === "Approved" && (
                    <div className="approved-message">
                      ✓ Appointment confirmed
                    </div>
                  )}

                  {appointment.status === "Cancelled" && (
                    <div className="cancelled-message">
                      Appointment cancelled
                    </div>
                  )}

                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default Appointments;



import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import useProfile from "../../hooks/useProfile";

function DoctorAppointments() {
  const { profile, loading } = useProfile("doctor");

  const [appointments, setAppointments] = useState([]);
  const [processingId, setProcessingId] = useState(null);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (profile) {
      fetchAppointments();
    }
  }, [profile]);

  async function fetchAppointments() {
    setFetching(true);

    const { data, error } = await supabase
      .from("appointments")
      .select(`
        *,
        patients(
          full_name,
          email
        )
      `)
      .eq("doctor_id", profile.id)
      .order("appointment_date", { ascending: true });

    if (!error) {
      setAppointments(data || []);
    }

    setFetching(false);
  }

  async function updateStatus(id, status) {
    if (status === "Cancelled") {
      const confirmCancel = window.confirm(
        "Are you sure you want to cancel this appointment?"
      );

      if (!confirmCancel) return;
    }

    setProcessingId(id);

    const { error } = await supabase
      .from("appointments")
      .update({ status })
      .eq("id", id);

    if (error) {
      alert(error.message);
    } else {
      await fetchAppointments();
    }

    setProcessingId(null);
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

  if (loading) {
    return (
      <DashboardLayout>
        <div className="appointment-empty">
          <div className="appointment-loader"></div>
          <p>Loading doctor profile...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="appointments-page">

        <div className="appointments-header">
          <div>
            <h1>Appointment Requests</h1>
            <p>
              Review and manage your patient appointment requests.
            </p>
          </div>

          <div className="appointment-count">
            {appointments.length} Request
            {appointments.length !== 1 ? "s" : ""}
          </div>
        </div>

        {fetching ? (
          <div className="appointment-empty">
            <div className="appointment-loader"></div>
            <p>Loading appointment requests...</p>
          </div>
        ) : appointments.length === 0 ? (
          <div className="appointment-empty">
            <div className="empty-icon">📋</div>
            <h3>No Appointment Requests</h3>
            <p>
              You currently have no appointment requests from patients.
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
                      {appointment.patients?.full_name
                        ?.charAt(0)
                        .toUpperCase() || "P"}
                    </div>

                    <div>
                      <h3>
                        {appointment.patients?.full_name ||
                          "Unknown Patient"}
                      </h3>

                      <span>
                        {appointment.patients?.email ||
                          "Email not available"}
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
                      <small>Appointment Date</small>
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
                      <small>Appointment Time</small>
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
                    <div className="doctor-action-buttons">
                      <button
                        className="approve-btn"
                        disabled={processingId === appointment.id}
                        onClick={() =>
                          updateStatus(
                            appointment.id,
                            "Approved"
                          )
                        }
                      >
                        {processingId === appointment.id
                          ? "Processing..."
                          : "✓ Approve"}
                      </button>

                      <button
                        className="doctor-cancel-btn"
                        disabled={processingId === appointment.id}
                        onClick={() =>
                          updateStatus(
                            appointment.id,
                            "Cancelled"
                          )
                        }
                      >
                        Cancel
                      </button>
                    </div>
                  )}

                  {appointment.status === "Approved" && (
                    <div className="approved-message">
                      ✓ Appointment approved
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

export default DoctorAppointments;


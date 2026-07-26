import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../context/AuthContext";
import DashboardLayout from "../../components/dashboard/DashboardLayout";

function DoctorAppointments() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    if (user) {
      fetchAppointments();
    }
  }, [user]);

  async function fetchAppointments() {
    const { data, error } = await supabase
      .from("appointments")
      .select("*")
      .eq("doctor_id", user.id);

    if (!error) {
      setAppointments(data);
    }
  }

  async function updateStatus(id, status) {
    const { error } = await supabase
      .from("appointments")
      .update({ status })
      .eq("id", id);

    if (!error) {
      fetchAppointments();
    }
  }

  return (
    <DashboardLayout>
      <h2>Appointment Requests</h2>

      {appointments.length === 0 ? (
        <p>No appointments found.</p>
      ) : (
        appointments.map((appointment) => (
          <div
            key={appointment.id}
            className="profile-card"
          >
            <p>
              <strong>Date:</strong>{" "}
              {appointment.appointment_date}
            </p>

            <p>
              <strong>Time:</strong>{" "}
              {appointment.appointment_time}
            </p>

     <p>
  <strong>Status:</strong>{" "}
  <span
    className={`status ${appointment.status.toLowerCase()}`}
  >
    {appointment.status}
  </span>
</p>

            <div
              style={{
                marginTop: "15px",
                display: "flex",
                gap: "10px",
              }}
            >
              <button
                className="book-btn"
                onClick={() =>
                  updateStatus(
                    appointment.id,
                    "Approved"
                  )
                }
              >
                Approve
              </button>

              <button
                className="book-btn"
                style={{
                  background: "#dc3545",
                }}
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
          </div>
        ))
      )}
    </DashboardLayout>
  );
}

export default DoctorAppointments;
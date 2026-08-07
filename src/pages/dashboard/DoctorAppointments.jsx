import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import useProfile from "../../hooks/useProfile";

function DoctorAppointments() {
  const { profile, loading } = useProfile("doctor");

  const [appointments, setAppointments] = useState([]);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (profile) {
      fetchAppointments();
    }
  }, [profile]);

  async function fetchAppointments() {
    const { data } = await supabase
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

    if (data) {
      setAppointments(data);
    }
  }

  async function updateStatus(id, status) {
    setProcessing(true);

    const { error } = await supabase
      .from("appointments")
      .update({ status })
      .eq("id", id);

    setProcessing(false);

    if (error) {
      alert(error.message);
      return;
    }

    fetchAppointments();
  }

  if (loading) {
    return (
      <DashboardLayout>
        <h2>Loading...</h2>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <h2>Appointment Requests</h2>

      {appointments.length === 0 ? (
        <p>No appointments found.</p>
      ) : (
        appointments.map((appointment) => (
          <div key={appointment.id} className="profile-card">
            <h3>
              {appointment.patients?.full_name || "Unknown Patient"}
            </h3>

            <p>
              <strong>Email:</strong>{" "}
              {appointment.patients?.email || "Not Available"}
            </p>

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

            {appointment.status === "Pending" && (
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  marginTop: "15px",
                }}
              >
                <button
                  className="book-btn"
                  disabled={processing}
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
                  disabled={processing}
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
            )}
          </div>
        ))
      )}
    </DashboardLayout>
  );
}

export default DoctorAppointments;
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "../styles/bookAppointment.css";

function BookAppointment() {
  const location = useLocation();
  const navigate = useNavigate();

  const doctor = location.state?.doctor;

  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [loading, setLoading] = useState(false);

  if (!doctor) {
    return (
      <div className="appointment-page">
        <h2>No doctor selected.</h2>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Temporary patient id (replace with logged-in patient later)
    const patientId = "876e55d1-5289-4e02-ae85-249cf1136674";

    const { error } = await supabase.from("appointments").insert([
      {
        patient_id: patientId,
        doctor_id: doctor.id,
        appointment_date: appointmentDate,
        appointment_time: appointmentTime,
        status: "Pending",
      },
    ]);

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Appointment Booked Successfully!");
    navigate("/doctors");
  };

  return (
    <div className="appointment-page">
      <form className="appointment-form" onSubmit={handleSubmit}>
        <h2>Book Appointment</h2>

        <input
          type="text"
          value={doctor.full_name}
          readOnly
        />

        <input
          type="text"
          value={doctor.specialty}
          readOnly
        />

        <input
          type="date"
          value={appointmentDate}
          onChange={(e) => setAppointmentDate(e.target.value)}
          required
        />

        <input
          type="time"
          value={appointmentTime}
          onChange={(e) => setAppointmentTime(e.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Booking..." : "Book Appointment"}
        </button>
      </form>
    </div>
  );
}

export default BookAppointment;
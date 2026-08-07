
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import "../styles/bookAppointment.css";

function BookAppointment() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const doctor = location.state?.doctor;

  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [loading, setLoading] = useState(false);

  if (!doctor) {
    return (
      <div className="book-container">
        <h2>No doctor selected.</h2>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("Please login first.");
      return;
    }

    if (!doctor.availability) {
      alert("This doctor is currently unavailable.");
      return;
    }

    if (!appointmentDate || !appointmentTime) {
      alert("Please fill all fields.");
      return;
    }

    const today = new Date().toISOString().split("T")[0];

    if (appointmentDate < today) {
      alert("You cannot book an appointment in the past.");
      return;
    }

    if (
      doctor.start_time &&
      appointmentTime < doctor.start_time
    ) {
      alert("Selected time is before doctor's working hours.");
      return;
    }

    if (
      doctor.end_time &&
      appointmentTime > doctor.end_time
    ) {
      alert("Selected time is after doctor's working hours.");
      return;
    }

    setLoading(true);

    try {
      const { data: existingAppointment } = await supabase
        .from("appointments")
        .select("id")
        .eq("doctor_id", doctor.id)
        .eq("appointment_date", appointmentDate)
        .eq("appointment_time", appointmentTime)
        .maybeSingle();

      if (existingAppointment) {
        setLoading(false);
        alert("This time slot is already booked.");
        return;
      }

      const { error } = await supabase
        .from("appointments")
        .insert([
          {
            patient_id: user.id,
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

      alert("Appointment booked successfully.");

      navigate("/patient/dashboard");
    } catch (err) {
      console.error(err);
      setLoading(false);
      alert("Something went wrong.");
    }
  };

  return (
    <div className="book-container">
      <form
        className="book-form"
        onSubmit={handleSubmit}
      >
        <h2>Book Appointment</h2>

        <label>Doctor</label>
        <input
          type="text"
          value={doctor.full_name}
          readOnly
        />

        <label>Specialty</label>
        <input
          type="text"
          value={doctor.specialty || "Not Added"}
          readOnly
        />

        <label>Availability</label>
        <input
          type="text"
          value={
            doctor.availability
              ? "Available"
              : "Unavailable"
          }
          readOnly
        />

        <label>Working Days</label>
        <input
          type="text"
          value={
            doctor.available_days || "Not Added"
          }
          readOnly
        />

        <label>Working Hours</label>
        <input
          type="text"
          value={`${doctor.start_time || "--"} - ${
            doctor.end_time || "--"
          }`}
          readOnly
        />

        <label>Select Date</label>
        <input
          type="date"
          value={appointmentDate}
          min={new Date().toISOString().split("T")[0]}
          onChange={(e) =>
            setAppointmentDate(e.target.value)
          }
          required
        />

        <label>Select Time</label>
        <input
          type="time"
          value={appointmentTime}
          onChange={(e) =>
            setAppointmentTime(e.target.value)
          }
          required
        />

        <button
          type="submit"
          disabled={
            loading || !doctor.availability
          }
        >
          {loading
            ? "Booking..."
            : "Book Appointment"}
        </button>
      </form>
    </div>
  );
}

export default BookAppointment;

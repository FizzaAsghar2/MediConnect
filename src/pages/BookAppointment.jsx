import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import "../styles/bookAppointment.css";

function BookAppointment() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, role } = useAuth();

  const doctor = location.state?.doctor;

  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  if (!doctor) {
    return (
      <div className="book-container">
        <div className="book-form">
          <h2>No doctor selected.</h2>
          <button
            type="button"
            onClick={() => navigate("/doctors")}
            style={{
              width: "100%",
              marginTop: "20px",
              padding: "14px",
              border: "0",
              borderRadius: "12px",
              background: "var(--color-primary)",
              color: "#fff",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Browse Doctors
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setIsError(false);

    if (!user) {
      setMessage("Please login first to book an appointment.");
      setIsError(true);
      return;
    }

    if (role && role !== "patient") {
      setMessage("Only patients can book appointments.");
      setIsError(true);
      return;
    }

    if (!doctor.availability) {
      setMessage("This doctor is currently unavailable.");
      setIsError(true);
      return;
    }

    if (!appointmentDate || !appointmentTime) {
      setMessage("Please fill all fields.");
      setIsError(true);
      return;
    }

    const today = new Date().toISOString().split("T")[0];

    if (appointmentDate < today) {
      setMessage("You cannot book an appointment in the past.");
      setIsError(true);
      return;
    }

    if (
      doctor.start_time &&
      appointmentTime < doctor.start_time
    ) {
      setMessage("Selected time is before doctor's working hours.");
      setIsError(true);
      return;
    }

    if (
      doctor.end_time &&
      appointmentTime > doctor.end_time
    ) {
      setMessage("Selected time is after doctor's working hours.");
      setIsError(true);
      return;
    }

    setLoading(true);

    try {
      const { data: existingAppointment, error: duplicateError } =
        await supabase
          .from("appointments")
          .select("id")
          .eq("doctor_id", doctor.id)
          .eq("appointment_date", appointmentDate)
          .eq("appointment_time", appointmentTime)
          .maybeSingle();

      if (duplicateError) {
        setMessage("Could not check availability: " + duplicateError.message);
        setIsError(true);
        return;
      }

      if (existingAppointment) {
        setMessage("This time slot is already booked.");
        setIsError(true);
        return;
      }

      const { error: appointmentError } =
        await supabase
          .from("appointments")
          .insert({
            patient_id: user.id,
            doctor_id: doctor.id,
            appointment_date: appointmentDate,
            appointment_time: appointmentTime,
            status: "Pending",
          });

      if (appointmentError) {
        setMessage("Booking failed: " + appointmentError.message);
        setIsError(true);
        return;
      }

      setMessage("Appointment booked successfully!");
      setIsError(false);

      setTimeout(() => {
        navigate("/patient/dashboard");
      }, 1500);

    } catch (error) {
      setMessage(error.message || "Something went wrong while booking.");
      setIsError(true);
    } finally {
      setLoading(false);
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

        {message && (
          <div
            style={{
              marginTop: "16px",
              padding: "12px 14px",
              borderRadius: "10px",
              background: isError ? "#fff1f2" : "#ecfdf3",
              border: `1px solid ${isError ? "#fecdd3" : "#bbf7d0"}`,
              color: isError ? "#be123c" : "#15803d",
              fontSize: "13px",
              lineHeight: 1.5,
            }}
          >
            {message}
          </div>
        )}

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

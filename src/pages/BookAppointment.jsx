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
      /* ===============================
         STEP 1: CHECK PATIENT PROFILE
         =============================== */

      const { data: patient, error: patientError } =
        await supabase
          .from("patients")
          .select("id")
          .eq("id", user.id)
          .maybeSingle();

      if (patientError) {
        console.error("Patient check error:", patientError);
        alert("Could not check patient profile: " + patientError.message);
        return;
      }

      /* ===============================
         STEP 2: CREATE PATIENT PROFILE
         IF IT DOES NOT EXIST
         =============================== */

      if (!patient) {
        const { error: createPatientError } =
          await supabase
            .from("patients")
            .insert({
              id: user.id,
              full_name:
                user.user_metadata?.full_name ||
                user.email?.split("@")[0] ||
                "Patient",
              email: user.email,
            });

        if (createPatientError) {
          console.error(
            "Patient creation error:",
            createPatientError
          );

          alert(
            "Patient profile error: " +
              createPatientError.message
          );

          return;
        }
      }

      /* ===============================
         STEP 3: CHECK DUPLICATE BOOKING
         =============================== */

      const { data: existingAppointment, error: duplicateError } =
        await supabase
          .from("appointments")
          .select("id")
          .eq("doctor_id", doctor.id)
          .eq("appointment_date", appointmentDate)
          .eq("appointment_time", appointmentTime)
          .maybeSingle();

      if (duplicateError) {
        console.error(
          "Duplicate check error:",
          duplicateError
        );

        alert(duplicateError.message);
        return;
      }

      if (existingAppointment) {
        alert("This time slot is already booked.");
        return;
      }

      /* ===============================
         STEP 4: BOOK APPOINTMENT
         =============================== */

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
        console.error(
          "Appointment booking error:",
          appointmentError
        );

        alert(
          "Booking failed: " +
            appointmentError.message
        );

        return;
      }

      alert("Appointment booked successfully!");

      navigate("/patient/dashboard");

    } catch (error) {
      console.error("Booking error:", error);
      alert(
        error.message ||
          "Something went wrong while booking."
      );
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
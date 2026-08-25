import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../context/AuthContext";
import DashboardLayout from "../../components/dashboard/DashboardLayout";

function DoctorList() {
  const { user, profile, role } = useAuth();

  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [bookingDoctor, setBookingDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    fetchDoctors();
  }, []);

  async function fetchDoctors() {
    setLoading(true);

    const { data, error } = await supabase
      .from("doctors")
      .select("*");

    if (error) {
      console.error("Doctors fetch error:", error);
    } else {
      setDoctors(data || []);
    }

    setLoading(false);
  }

  function openBooking(doctorId) {
    setBookingDoctor(doctorId);
    setAppointmentDate("");
    setAppointmentTime("");
  }

  function closeBooking() {
    setBookingDoctor(null);
    setAppointmentDate("");
    setAppointmentTime("");
  }

  async function bookAppointment(doctorId) {
    if (!user) {
      alert("Please login first.");
      return;
    }

    if (role && role !== "patient") {
      alert("Only patients can book appointments.");
      return;
    }

    if (!appointmentDate || !appointmentTime) {
      alert("Please select an appointment date and time.");
      return;
    }

    const selectedDateTime = new Date(
      `${appointmentDate}T${appointmentTime}`
    );

    if (selectedDateTime <= new Date()) {
      alert("Please select a future date and time.");
      return;
    }

    setBooking(true);

    try {
      // Get the patient profile using the logged-in user's ID
      const { data: patient, error: patientError } = await supabase
        .from("patients")
        .select("id, full_name, email")
        .eq("id", user.id)
        .maybeSingle();

      if (patientError) {
        console.error("Patient fetch error:", patientError);

        alert(
          "Could not find your patient profile: " +
            patientError.message
        );

        return;
      }

      // Patient profile MUST exist before booking
      if (!patient) {
        alert(
          "Your patient profile does not exist. Please logout and login again."
        );

        return;
      }

      console.log("Patient profile used for booking:", patient);
      console.log("Patient ID:", patient.id);
      console.log("Doctor ID:", doctorId);

      // Check duplicate appointment
      const { data: existingAppointment, error: duplicateError } =
        await supabase
          .from("appointments")
          .select("id")
          .eq("patient_id", patient.id)
          .eq("doctor_id", doctorId)
          .eq("appointment_date", appointmentDate)
          .eq("appointment_time", appointmentTime)
          .maybeSingle();

      if (duplicateError) {
        console.error(
          "Appointment check error:",
          duplicateError
        );

        alert(
          "Could not check appointment: " +
            duplicateError.message
        );

        return;
      }

      if (existingAppointment) {
        alert(
          "You already have an appointment with this doctor at this date and time."
        );

        return;
      }

      // Create appointment using patient.id
      const { error: appointmentError } = await supabase
        .from("appointments")
        .insert({
          patient_id: patient.id,
          doctor_id: doctorId,
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

      closeBooking();
    } catch (error) {
      console.error("Booking error:", error);

      alert(
        error.message ||
          "Something went wrong while booking."
      );
    } finally {
      setBooking(false);
    }
  }

  const filteredDoctors = doctors.filter((doctor) => {
    const value = search.toLowerCase();

    return (
      doctor.full_name
        ?.toLowerCase()
        .includes(value) ||
      doctor.specialty
        ?.toLowerCase()
        .includes(value)
    );
  });

  return (
    <DashboardLayout>
      <div className="doctors-page">

        <div className="doctors-header">
          <div>
            <h1>Find a Doctor</h1>

            <p>
              Search for a doctor and book your appointment.
            </p>
          </div>

          <div className="doctor-count">
            {filteredDoctors.length} Doctor
            {filteredDoctors.length !== 1 ? "s" : ""}
          </div>
        </div>

        <div className="doctor-search-wrapper">
          <span>🔍</span>

          <input
            type="text"
            placeholder="Search by doctor name or specialty..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />
        </div>

        {loading ? (
          <div className="appointment-empty">
            <div className="appointment-loader"></div>

            <p>
              Finding available doctors...
            </p>
          </div>

        ) : filteredDoctors.length === 0 ? (

          <div className="appointment-empty">
            <div className="empty-icon">
              👨‍⚕️
            </div>

            <h3>No Doctors Found</h3>

            <p>
              Try searching with a different name or specialty.
            </p>
          </div>

        ) : (

          <div className="doctors-grid">

            {filteredDoctors.map((doctor) => (

              <div
                key={doctor.id}
                className="doctor-card"
              >

                <div className="doctor-card-top">

                  <div className="doctor-large-avatar">
                    {doctor.full_name
                      ?.charAt(0)
                      .toUpperCase() || "D"}
                  </div>

                  <div>
                    <h3>
                      Dr. {doctor.full_name}
                    </h3>

                    <span className="doctor-specialty">
                      {doctor.specialty ||
                        "General Physician"}
                    </span>
                  </div>

                </div>

                <div className="doctor-card-info">

                  <div>
                    <small>Email</small>

                    <p>
                      {doctor.email ||
                        "Not available"}
                    </p>
                  </div>

                  <div>
                    <small>Experience</small>

                    <p>
                      {doctor.experience
                        ? `${doctor.experience} years`
                        : "Not added"}
                    </p>
                  </div>

                </div>

                {bookingDoctor === doctor.id ? (

                  <div className="booking-box">

                    <h4>
                      Book Appointment
                    </h4>

                    <label>
                      Appointment Date
                    </label>

                    <input
                      type="date"
                      value={appointmentDate}
                      min={
                        new Date()
                          .toISOString()
                          .split("T")[0]
                      }
                      onChange={(e) =>
                        setAppointmentDate(
                          e.target.value
                        )
                      }
                    />

                    <label>
                      Appointment Time
                    </label>

                    <input
                      type="time"
                      value={appointmentTime}
                      onChange={(e) =>
                        setAppointmentTime(
                          e.target.value
                        )
                      }
                    />

                    <div className="booking-actions">

                      <button
                        className="book-btn"
                        disabled={booking}
                        onClick={() =>
                          bookAppointment(
                            doctor.id
                          )
                        }
                      >
                        {booking
                          ? "Booking..."
                          : "Confirm Booking"}
                      </button>

                      <button
                        className="close-booking-btn"
                        disabled={booking}
                        onClick={closeBooking}
                      >
                        Cancel
                      </button>

                    </div>

                  </div>

                ) : (

                  <button
                    className="doctor-book-btn"
                    onClick={() =>
                      openBooking(doctor.id)
                    }
                  >
                    Book Appointment
                  </button>

                )}

              </div>

            ))}

          </div>
        )}

      </div>
    </DashboardLayout>
  );
}

export default DoctorList;
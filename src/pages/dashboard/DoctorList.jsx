import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../context/AuthContext";
import DashboardLayout from "../../components/dashboard/DashboardLayout";

function DoctorList() {
  const { user } = useAuth();

  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState("");

  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");

  useEffect(() => {
    fetchDoctors();
  }, []);

  async function fetchDoctors() {
    const { data, error } = await supabase
      .from("doctors")
      .select("*");

    if (!error) {
      setDoctors(data);
    }
  }

  async function bookAppointment(doctorId) {
    if (!appointmentDate || !appointmentTime) {
      alert("Please select date and time.");
      return;
    }

    const { error } = await supabase
      .from("appointments")
      .insert({
        patient_id: user.id,
        doctor_id: doctorId,
        appointment_date: appointmentDate,
        appointment_time: appointmentTime,
        status: "Pending",
      });

    if (error) {
      alert(error.message);
    } else {
      alert("Appointment booked successfully!");

      // Clear inputs after booking
      setAppointmentDate("");
      setAppointmentTime("");
    }
  }

  const filteredDoctors = doctors.filter((doctor) => {
    const value = search.toLowerCase();

    return (
      doctor.full_name.toLowerCase().includes(value) ||
      doctor.specialty.toLowerCase().includes(value)
    );
  });

  return (
    <DashboardLayout>
      <h2>Available Doctors</h2>

      <input
        type="text"
        placeholder="Search doctor by name or specialty..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-input"
      />

      {filteredDoctors.length === 0 ? (
        <p>No doctors available.</p>
      ) : (
        filteredDoctors.map((doctor) => (
          <div
            key={doctor.id}
            className="profile-card"
          >
            <h3>{doctor.full_name}</h3>

            <p>
              <strong>Specialty:</strong> {doctor.specialty}
            </p>

            <p>
              <strong>Email:</strong> {doctor.email}
            </p>

            <input
              type="date"
              value={appointmentDate}
              onChange={(e) =>
                setAppointmentDate(e.target.value)
              }
              className="search-input"
            />

            <input
              type="time"
              value={appointmentTime}
              onChange={(e) =>
                setAppointmentTime(e.target.value)
              }
              className="search-input"
            />

            <button
              className="book-btn"
              onClick={() => bookAppointment(doctor.id)}
            >
              Book Appointment
            </button>
          </div>
        ))
      )}
    </DashboardLayout>
  );
}

export default DoctorList;
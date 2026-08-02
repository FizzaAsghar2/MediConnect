import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "../styles/doctors.css";

function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDoctors();

    const channel = supabase
      .channel("doctor-updates")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "doctors",
        },
        () => {
          fetchDoctors();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function fetchDoctors() {
    setLoading(true);

    const { data, error } = await supabase
      .from("doctors")
      .select("*")
      .order("full_name");

    if (error) {
      console.error(error);
      setDoctors([]);
    } else {
      setDoctors(data);
    }

    setLoading(false);
  }

  return (
    <div className="doctors-page">
      <div className="container">
        <h1>Our Doctors</h1>
        <p>Choose a doctor according to your healthcare needs.</p>

        {loading ? (
          <h2>Loading doctors...</h2>
        ) : doctors.length === 0 ? (
          <h2>No doctors available.</h2>
        ) : (
          <div className="doctor-grid">
            {doctors.map((doctor) => (
              <div className="doctor-card" key={doctor.id}>
                <img
                  src={doctor.image || "https://via.placeholder.com/150"}
                  alt={doctor.full_name}
                />

                <h3>{doctor.full_name}</h3>

                <p>
                  <strong>Specialty:</strong> {doctor.specialty || "Not Added"}
                </p>

                <p>
                  <strong>Experience:</strong>{" "}
                  {doctor.experience || "Not Added"}
                </p>

                <Link
                  to="/book-appointment"
                  state={{ doctor }}
                >
                  <button>Book Appointment</button>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Doctors;

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
          event: "*",
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
      console.log(error);
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

        <p>
          Choose a doctor according to your healthcare
          needs.
        </p>

        {loading ? (
          <h2>Loading...</h2>
        ) : doctors.length === 0 ? (
          <h2>No Doctors Found</h2>
        ) : (
          <div className="doctor-grid">
            {doctors.map((doctor) => (
              <div
                className="doctor-card"
                key={doctor.id}
              >
                <img
                  src={
                    doctor.image ||
                    "https://via.placeholder.com/150"
                  }
                  alt={doctor.full_name}
                />

                <h3>{doctor.full_name}</h3>

                <p>
                  <strong>Specialty:</strong>{" "}
                  {doctor.specialty || "Not Added"}
                </p>

                <p>
                  <strong>Experience:</strong>{" "}
                  {doctor.experience || "Not Added"}
                </p>

                <p>
                  <strong>Available:</strong>{" "}
                  {doctor.availability
                    ? "Yes"
                    : "No"}
                </p>

                <p>
                  <strong>Working Days:</strong>{" "}
                  {doctor.available_days ||
                    "Not Added"}
                </p>

                <p>
                  <strong>Working Hours:</strong>{" "}
                  {doctor.start_time} -{" "}
                  {doctor.end_time}
                </p>

                {doctor.availability ? (
                  <Link
                    to="/book-appointment"
                    state={{ doctor }}
                  >
                    <button>
                      Book Appointment
                    </button>
                  </Link>
                ) : (
                  <button
                    disabled
                    style={{
                      background: "#999",
                      cursor: "not-allowed",
                    }}
                  >
                    Not Available
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Doctors;

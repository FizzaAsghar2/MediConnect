import { Link } from "react-router-dom";
import "../styles/doctors.css";

const doctors = [
  {
    id: 1,
    name: "Dr. Sarah Khan",
    specialty: "Cardiologist",
    experience: "10 Years",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    id: 2,
    name: "Dr. Ali Ahmed",
    specialty: "Dermatologist",
    experience: "8 Years",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    id: 3,
    name: "Dr. Ayesha Malik",
    specialty: "Pediatrician",
    experience: "12 Years",
    image: "https://randomuser.me/api/portraits/women/68.jpg",
  },
];

function Doctors() {
  return (
    <div className="doctors-page">
      <div className="container">
        <h1>Our Doctors</h1>
        <p>Choose a doctor according to your healthcare needs.</p>

        <div className="doctor-grid">
          {doctors.map((doctor) => (
            <div className="doctor-card" key={doctor.id}>
              <img src={doctor.image} alt={doctor.name} />

              <h3>{doctor.name}</h3>

              <p>
                <strong>Specialty:</strong> {doctor.specialty}
              </p>

              <p>
                <strong>Experience:</strong> {doctor.experience}
              </p>

              <Link to="/patient/login">
                <button>Book Appointment</button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Doctors;
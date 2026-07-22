import "./Auth.css";
import { FaHospital } from "react-icons/fa6";
import healthcare from "../../assets/images/healthcare.svg";

function AuthLayout({ title, subtitle, children }) {
  return (
    <section className="auth-page">
      <div className="auth-container">

        {/* LEFT */}
        <div className="auth-left">

          <div className="circle circle-1"></div>
          <div className="circle circle-2"></div>

          <div className="auth-content">

            <div className="logo">
              <FaHospital />
              <span>MediCare</span>
            </div>

            <span className="auth-badge">
              Smart Healthcare Platform
            </span>

            <h1>
              Your Health,
              <br />
              Our Priority
            </h1>

            <p>
              Securely connect with trusted doctors,
              book appointments,
              manage medical records,
              and receive healthcare anywhere.
            </p>

            <img
              src={healthcare}
              alt="Healthcare"
              className="auth-image"
            />

            <div className="auth-stats">
              <div className="stat-card">
                <h4>100+</h4>
                <span>Doctors</span>
              </div>

              <div className="stat-card">
                <h4>5K+</h4>
                <span>Patients</span>
              </div>

              <div className="stat-card">
                <h4>24/7</h4>
                <span>Support</span>
              </div>
            </div>

          </div>

        </div>

        {/* RIGHT */}
        <div className="auth-right">

          <div className="auth-box">

            <h2>{title}</h2>

            <p>{subtitle}</p>

            {children}

          </div>

        </div>

      </div>
    </section>
  );
}

export default AuthLayout;
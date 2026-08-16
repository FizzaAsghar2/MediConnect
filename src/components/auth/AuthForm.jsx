
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaUser, FaEye, FaEyeSlash } from "react-icons/fa";
import { supabase } from "../../lib/supabase";

const AuthForm = ({
  role = "patient",
  isRegister = false,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [specialization, setSpecialization] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      if (!isRegister) {
        /* ================= LOGIN ================= */

        const { data, error: loginError } =
          await supabase.auth.signInWithPassword({
            email,
            password,
          });

       if (loginError) {
  console.log("LOGIN ERROR:", loginError);
  throw loginError;
}

        if (role === "doctor") {
          navigate("/doctor/dashboard");
        } else {
          navigate("/patient/dashboard");
        }

        return;
      }

      /* ================= REGISTER ================= */

      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role,
            full_name: name,
          },
        },
      });

      if (signUpError) {
        throw signUpError;
      }

      const userId = data.user?.id;

      if (!userId) {
        throw new Error("Unable to create account.");
      }

      if (role === "patient") {
        const { error: patientError } = await supabase
          .from("patients")
          .insert([
            {
              id: userId,
              full_name: name,
              email,
            },
          ]);

        if (patientError) {
          throw patientError;
        }
      }

      if (role === 'doctor') {
  const { error: doctorInsertError } = await supabase
    .from("doctors")
    .insert([
      {
        id: userId,
        full_name: name,
        email,
        specialty: specialization || "General Physician",
      },
    ]);

  if (doctorInsertError) throw doctorInsertError;

      }

      /*
       * Registration is complete.
       * Do NOT send the user directly to the dashboard.
       * Sign them out and send them to the correct login page.
       */

      await supabase.auth.signOut();

      if (role === "doctor") {
        navigate("/doctor/login", {
          state: {
            message: "Registration successful. Please login to continue.",
          },
        });
      } else {
        navigate("/patient/login", {
          state: {
            message: "Registration successful. Please login to continue.",
          },
        });
      }
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form">

      {error && (
        <div className="auth-error">
          {error}
        </div>
      )}

      <form onSubmit={handleAuth}>

        {/* Full Name */}
        {isRegister && (
          <div className="input-group">
            <label>Full Name</label>

            <div className="input-wrapper">
              <FaUser className="input-icon" />

              <input
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>
        )}

        {/* Doctor Specialization */}
        {isRegister && role === "doctor" && (
          <div className="input-group">
            <label>Specialization</label>

            <div className="input-wrapper">
              <input
                type="text"
                placeholder="e.g. Cardiology"
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                required
              />
            </div>
          </div>
        )}

        {/* Email */}
        <div className="input-group">
          <label>Email Address</label>

          <div className="input-wrapper">
            <FaEnvelope className="input-icon" />

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Password */}
        <div className="input-group">
          <label>Password</label>

          <div className="input-wrapper">
            <FaLock className="input-icon" />

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              required
            />

            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              aria-label="Toggle password visibility"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="auth-btn"
          disabled={loading}
        >
          {loading
            ? "Processing..."
            : isRegister
            ? "Create Account"
            : "Login"}
        </button>

      </form>

      {/* Switch */}
      <div className="auth-switch">
        {isRegister ? (
          <>
            Already have an account?{" "}
            <button
              type="button"
              onClick={() =>
                navigate(
                  role === "doctor"
                    ? "/doctor/login"
                    : "/patient/login"
                )
              }
            >
              Login
            </button>
          </>
        ) : (
          <>
            Don't have an account?{" "}
            <button
              type="button"
              onClick={() =>
                navigate(
                  role === "doctor"
                    ? "/doctor/register"
                    : "/patient/register"
                )
              }
            >
              Create Account
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthForm;


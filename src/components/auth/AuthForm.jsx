import { useState } from "react";
import { Link } from "react-router-dom";

import {
  MdEmail,
  MdLock,
  MdPerson,
} from "react-icons/md";

import { FaUserDoctor } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { FaArrowRight } from "react-icons/fa";

import InputField from "./InputField";

function AuthForm({ role, isRegister = false }) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    specialty: "",
    age: "",
    gender: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const validate = () => {
    let newErrors = {};

    if (isRegister && !formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (
      isRegister &&
      formData.password !== formData.confirmPassword
    ) {
      newErrors.confirmPassword =
        "Passwords do not match";
    }

    if (
      isRegister &&
      role === "doctor" &&
      !formData.specialty.trim()
    ) {
      newErrors.specialty = "Specialty is required";
    }

    if (isRegister && role === "patient") {
      if (!formData.age) {
        newErrors.age = "Age is required";
      }

      if (!formData.gender.trim()) {
        newErrors.gender = "Gender is required";
      }
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});

    alert("Form validated successfully!");
  };

return (
  <form className="auth-form" onSubmit={handleSubmit}>

    {isRegister && (
      <InputField
        label="Full Name"
        icon={<MdPerson />}
        name="fullName"
        value={formData.fullName}
        onChange={handleChange}
        placeholder="Enter your full name"
        error={errors.fullName}
      />
    )}

    <InputField
      label="Email Address"
      icon={<MdEmail />}
      type="email"
      name="email"
      value={formData.email}
      onChange={handleChange}
      placeholder="Enter your email"
      error={errors.email}
    />

    <InputField
      label="Password"
      icon={<MdLock />}
      type="password"
      name="password"
      value={formData.password}
      onChange={handleChange}
      placeholder="Enter your password"
      error={errors.password}
    />

    {isRegister && (
      <InputField
        label="Confirm Password"
        icon={<MdLock />}
        type="password"
        name="confirmPassword"
        value={formData.confirmPassword}
        onChange={handleChange}
        placeholder="Confirm your password"
        error={errors.confirmPassword}
      />
    )}

    {isRegister && role === "doctor" && (
      <InputField
        label="Specialty"
        icon={<FaUserDoctor />}
        name="specialty"
        value={formData.specialty}
        onChange={handleChange}
        placeholder="e.g. Cardiologist"
        error={errors.specialty}
      />
    )}

    {isRegister && role === "patient" && (
      <>
        <InputField
          label="Age"
          type="number"
          name="age"
          value={formData.age}
          onChange={handleChange}
          placeholder="Enter your age"
          error={errors.age}
        />

        <InputField
          label="Gender"
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          placeholder="Male / Female"
          error={errors.gender}
        />
      </>
    )}

    {!isRegister && (
      <div className="auth-options">
        <label>
          <input type="checkbox" />
          Remember me
        </label>

        <a href="#">Forgot Password?</a>
      </div>
    )}

    <button type="submit" className="auth-btn">
      <span>
        {isRegister ? "Create Account" : "Login"}
      </span>

      <FaArrowRight />
    </button>

    <div className="divider">
      <span>or continue with</span>
    </div>

    <button
      type="button"
      className="google-btn"
    >
      <FcGoogle className="google-icon" />
      Continue with Google
    </button>

    <div className="auth-switch">

      {isRegister ? (
        <>
          Already have an account?

          <Link
            to={
              role === "doctor"
                ? "/doctor/login"
                : "/patient/login"
            }
          >
            Login
          </Link>
        </>
      ) : (
        <>
          Don't have an account?

          <Link
            to={
              role === "doctor"
                ? "/doctor/register"
                : "/patient/register"
            }
          >
            Register
          </Link>
        </>
      )}

    </div>

  </form>
);

}

export default AuthForm;
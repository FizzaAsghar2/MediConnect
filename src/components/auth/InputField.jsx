import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function InputField({
  label,
  icon,
  type = "text",
  placeholder,
  name,
  value,
  onChange,
  error,
}) {
  const [showPassword, setShowPassword] = useState(false);

  const inputType =
    type === "password"
      ? showPassword
        ? "text"
        : "password"
      : type;

  return (
    <div className="input-group">
      <label>{label}</label>

      <div className="input-wrapper">

        {icon && (
          <span className="input-icon">
            {icon}
          </span>
        )}

        <input
          className={error ? "input-error" : ""}
          type={inputType}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
        />

        {type === "password" && (
          <button
            type="button"
            className="password-toggle"
            onClick={() =>
              setShowPassword(!showPassword)
            }
          >
            {showPassword ? (
              <FaEyeSlash />
            ) : (
              <FaEye />
            )}
          </button>
        )}

      </div>

      {error && (
        <small className="error-text">
          {error}
        </small>
      )}
    </div>
  );
}

export default InputField;
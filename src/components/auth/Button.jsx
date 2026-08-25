import { FaArrowRight } from "react-icons/fa";

function Button({ text, type = "submit" }) {
  return (
    <button className="auth-btn" type={type}>
      <span>{text}</span>
      <FaArrowRight />
    </button>
  );
}

export default Button;
import { useNavigate } from "react-router-dom";

function NotFound() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--color-bg)",
        textAlign: "center",
        padding: "20px",
      }}
    >
      <h1
        style={{
          fontSize: "clamp(4rem, 12vw, 8rem)",
          color: "var(--color-primary)",
          margin: 0,
          lineHeight: 1,
        }}
      >
        404
      </h1>

      <h2
        style={{
          color: "var(--color-secondary)",
          margin: "16px 0 8px",
          fontSize: "1.5rem",
        }}
      >
        Page Not Found
      </h2>

      <p
        style={{
          color: "var(--color-text-muted)",
          maxWidth: "420px",
          marginBottom: "30px",
        }}
      >
        The page you are looking for doesn't exist or has been moved.
      </p>

      <button
        className="btn"
        onClick={() => navigate("/")}
        style={{
          padding: "14px 32px",
          background: "var(--color-primary)",
          color: "#fff",
          border: "none",
          borderRadius: "999px",
          fontSize: "1rem",
          fontWeight: 700,
          cursor: "pointer",
        }}
      >
        Back to Home
      </button>
    </div>
  );
}

export default NotFound;

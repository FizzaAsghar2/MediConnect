import AuthLayout from "../../components/auth/AuthLayout";
import AuthForm from "../../components/auth/AuthForm";

function PatientLogin() {
  return (
    <AuthLayout
      title="Patient Login"
      subtitle="Welcome back! Login to access your healthcare services."
    >
      <AuthForm
        role="patient"
        isRegister={false}
      />
    </AuthLayout>
  );
}

export default PatientLogin;
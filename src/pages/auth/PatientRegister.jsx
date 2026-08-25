import AuthLayout from "../../components/auth/AuthLayout";
import AuthForm from "../../components/auth/AuthForm";

function PatientRegister() {
  return (
    <AuthLayout
      title="Patient Registration"
      subtitle="Create your patient account to get started."
    >
      <AuthForm
        role="patient"
        isRegister={true}
      />
    </AuthLayout>
  );
}

export default PatientRegister;
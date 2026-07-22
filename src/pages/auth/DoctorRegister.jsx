import AuthLayout from "../../components/auth/AuthLayout";
import AuthForm from "../../components/auth/AuthForm";

function DoctorRegister() {
  return (
    <AuthLayout
      title="Doctor Registration"
      subtitle="Create your doctor account to join the platform."
    >
      <AuthForm
        role="doctor"
        isRegister={true}
      />
    </AuthLayout>
  );
}

export default DoctorRegister;
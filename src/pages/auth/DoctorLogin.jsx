import AuthLayout from "../../components/auth/AuthLayout";
import AuthForm from "../../components/auth/AuthForm";

function DoctorLogin() {
  return (
    <AuthLayout
      title="Doctor Login"
      subtitle="Welcome back! Login to manage your appointments."
    >
      <AuthForm
        role="doctor"
        isRegister={false}
      />
    </AuthLayout>
  );
}

export default DoctorLogin;
import { AuthPage } from "@/features/auth/components/auth-page";
import type { AuthPageContent } from "@/features/auth/types/auth-page";

const loginContent: AuthPageContent = {
  mode: "login",
  title: "Know what your team is actually building",
  description: "Sign in to your BuildTruth workspace.",
  emailLabel: "Email",
  passwordPlaceholder: "Password",
  submitLabel: "Login",
  footerText: "Don't have an account?",
  footerHref: "/signup",
  footerAction: "Sign up",
};

export default function LoginPage() {
  return <AuthPage content={loginContent} />;
}

import { AuthPage } from "@/features/auth/components/auth-page";
import type { AuthPageContent } from "@/features/auth/types/auth-page";

const signupContent: AuthPageContent = {
  mode: "signup",
  title: "Stop guessing. Start seeing.",
  description: "Create your BuildTruth workspace in 60 seconds.",
  emailLabel: "Work email",
  passwordPlaceholder: "At least 8 characters",
  submitLabel: "Get Started",
  footerText: "Already have an account?",
  footerHref: "/login",
  footerAction: "Login",
};

export default function SignupPage() {
  return <AuthPage content={signupContent} />;
}

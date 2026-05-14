export type AuthPageMode = "login" | "signup";

export type AuthPageContent = {
  mode: AuthPageMode;
  title: string;
  description: string;
  emailLabel: string;
  passwordPlaceholder: string;
  submitLabel: string;
  footerText: string;
  footerHref: string;
  footerAction: string;
};

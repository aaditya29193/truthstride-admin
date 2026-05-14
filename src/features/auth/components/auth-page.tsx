import { AuthCard } from "@/features/auth/components/auth-card";
import { BuildtruthLogo } from "@/features/auth/components/buildtruth-logo";
import type { AuthPageContent } from "@/features/auth/types/auth-page";

type AuthPageProps = {
  content: AuthPageContent;
};

export function AuthPage({ content }: AuthPageProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#080d14] px-4 py-12 text-white">
      <div className="w-full max-w-[367px]">
        <div className="mb-8">
          <BuildtruthLogo />
        </div>
        <AuthCard content={content} />
      </div>
    </main>
  );
}

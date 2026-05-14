type PlaceholderDashboardPageProps = {
  description: string;
  title: string;
};

export function PlaceholderDashboardPage({ description, title }: PlaceholderDashboardPageProps) {
  return (
    <main className="min-w-0">
      <header className="border-b border-[#202a3f] px-5 py-6 sm:px-8 lg:px-10">
        <h1 className="text-3xl font-semibold tracking-normal text-[#f8fafc]">{title}</h1>
        <p className="mt-2 max-w-xl text-[15px] leading-6 text-[#9ca3af]">{description}</p>
      </header>
      <section className="px-5 py-8 sm:px-8 lg:px-10">
        <div className="rounded-2xl border border-[#202a3f] bg-[#111827] p-6">
          <p className="text-sm leading-6 text-[#9ca3af]">
            This section is ready for the next build step.
          </p>
        </div>
      </section>
    </main>
  );
}

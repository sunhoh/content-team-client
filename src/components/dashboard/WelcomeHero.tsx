import { OnlineBadge } from "@/components/ui/Badge";

export function WelcomeHero() {
  return (
    <div className="relative mb-5 overflow-hidden rounded-2xl bg-base neu-raised px-5 py-5 sm:px-8 sm:py-7">
      {/* Purple glow */}
      <div
        className="pointer-events-none absolute -left-10 -top-10 h-48 w-72 rounded-full opacity-25"
        style={{
          background:
            "radial-gradient(circle, #7c3aed 0%, #4f46e5 40%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />
      <div
        className="pointer-events-none absolute right-0 top-0 h-32 w-48 rounded-full opacity-10"
        style={{
          background:
            "radial-gradient(circle, #2dd4bf 0%, transparent 70%)",
          filter: "blur(30px)",
        }}
      />

      <div className="relative">
        {/* <OnlineBadge /> */}
        <h1 className="mt-3 text-2xl font-bold tracking-tight text-ink sm:text-3xl">
          안녕하세요,
          <span className="text-violet-pale">Max</span>님
        </h1>
        <p className="mt-1.5 text-sm text-ink-dim">
          오늘 에이전트들이
          <span className="font-semibold text-violet-soft">127개</span> 작업을
          완료했습니다
        </p>
      </div>
    </div>
  );
}

import { OnlineBadge } from '@/components/ui/Badge';

export function WelcomeHero() {
  return (
    <div className='bg-base neu-raised relative mb-5 overflow-hidden rounded-2xl px-5 py-5 sm:px-8 sm:py-7'>
      {/* Purple glow */}
      <div
        className='pointer-events-none absolute -top-10 -left-10 h-48 w-72 rounded-full opacity-25'
        style={{
          background:
            'radial-gradient(circle, #7c3aed 0%, #4f46e5 40%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />
      <div
        className='pointer-events-none absolute top-0 right-0 h-32 w-48 rounded-full opacity-10'
        style={{
          background: 'radial-gradient(circle, #2dd4bf 0%, transparent 70%)',
          filter: 'blur(30px)',
        }}
      />

      <div className='relative'>
        {/* <OnlineBadge /> */}
        <h1 className='text-ink mt-3 text-2xl font-bold tracking-tight sm:text-3xl'>
          안녕하세요
          {/* <span className='text-violet-soft'>입니다</span> */}
        </h1>
        <p className='text-ink-dim mt-1.5 text-sm'>
          오늘 에이전트들이
          <span className='text-violet-soft font-semibold'>127개</span> 작업을
          완료했습니다
        </p>
      </div>
    </div>
  );
}

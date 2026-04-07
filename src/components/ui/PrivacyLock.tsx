export interface PrivacyLockProps {
  extra?: string
}

export function PrivacyLock({ extra }: PrivacyLockProps) {
  return (
    <div className="flex items-center gap-2 text-[#D4AF37]/30 text-[10px]">
      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
      Private — stored only on this device{extra}
    </div>
  )
}

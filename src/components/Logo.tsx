export default function Logo({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <rect x="1" y="1" width="30" height="30" stroke="currentColor" strokeOpacity=".5" />
      <path d="M1 8V1h7M24 1h7v7M31 24v7h-7M8 31H1v-7" stroke="currentColor" strokeWidth="2" />
      <path d="M9 23 16 8l7 15M11.6 18h8.8" stroke="var(--color-accent)" strokeWidth="1.8" strokeLinecap="square" />
    </svg>
  )
}

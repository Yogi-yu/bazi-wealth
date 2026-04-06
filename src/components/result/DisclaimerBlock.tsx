interface Props {
  text: string
}

export default function DisclaimerBlock({ text }: Props) {
  return (
    <div className="rounded-xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] p-5">
      <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-ink-muted">
        <span className="text-[rgba(201,168,76,0.5)]">◈</span>
        免责声明
        <span className="text-[rgba(201,168,76,0.5)]">◈</span>
      </div>
      <p className="text-xs leading-relaxed text-ink-muted">{text}</p>
    </div>
  )
}

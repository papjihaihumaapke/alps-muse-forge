import type { SortOrder } from "@/lib/journey";

/** Newest/oldest control for the admin-managed write-up lists. */
export function SortSelect({
  value,
  onChange,
  className = "",
}: {
  value: SortOrder;
  onChange: (order: SortOrder) => void;
  className?: string;
}) {
  return (
    <label
      className={`flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase text-foreground/60 ${className}`}
    >
      sort
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as SortOrder)}
        className="bg-transparent border border-border px-2 py-1 text-[11px] tracking-wide uppercase text-foreground/80"
      >
        <option value="newest">newest first</option>
        <option value="oldest">oldest first</option>
      </select>
    </label>
  );
}

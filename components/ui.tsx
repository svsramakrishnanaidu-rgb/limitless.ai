"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { X } from "lucide-react";

export function Glass({
  children,
  className = "",
  interactive = false,
  as: Tag = "div",
  ...rest
}: {
  children: ReactNode;
  className?: string;
  interactive?: boolean;
  as?: "div" | "section" | "article" | "aside";
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <Tag
      className={`liquid-glass ${interactive ? "glass-interactive" : ""} ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {eyebrow && <p className="eyebrow mb-2">{eyebrow}</p>}
        <h1 className="page-title">{title}</h1>
        {description && <p className="lead mt-2">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </header>
  );
}

export function SectionHeading({
  title,
  action,
  hint,
}: {
  title: string;
  action?: ReactNode;
  hint?: string;
}) {
  return (
    <div className="mb-3 flex items-baseline justify-between gap-3">
      <div>
        <h2 className="section-title">{title}</h2>
        {hint && <p className="small muted mt-0.5">{hint}</p>}
      </div>
      {action}
    </div>
  );
}

export function Field({
  label,
  hint,
  error,
  children,
  htmlFor,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
  htmlFor?: string;
}) {
  return (
    <div>
      <label className="field-label" htmlFor={htmlFor}>
        {label}
      </label>
      {children}
      {hint && !error && <p className="field-hint">{hint}</p>}
      {error && (
        <p className="field-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  wide = false,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  wide?: boolean;
}) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && panelRef.current) {
        const focusable = panelRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        } else if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    const timer = window.setTimeout(() => {
      panelRef.current?.querySelector<HTMLElement>("input, button, select, textarea")?.focus();
    }, 40);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      window.clearTimeout(timer);
      previous?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-end justify-center p-0 sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      style={{ background: "rgba(3, 8, 6, 0.66)", backdropFilter: "blur(6px)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        className="liquid-glass w-full overflow-y-auto"
        style={{
          maxWidth: wide ? 760 : 560,
          maxHeight: "92dvh",
          borderRadius: "22px 22px 0 0",
          background: "var(--panel-strong)",
        }}
      >
        <div className="flex items-start justify-between gap-4 border-b px-5 py-4" style={{ borderColor: "var(--line)" }}>
          <h2 id={titleId} className="brand-serif text-xl">
            {title}
          </h2>
          <button type="button" className="icon-button" onClick={onClose} aria-label="Close dialog">
            <X size={18} aria-hidden />
          </button>
        </div>
        <div className="px-5 py-4">{children}</div>
        {footer && (
          <div className="flex flex-wrap justify-end gap-2 border-t px-5 py-4" style={{ borderColor: "var(--line)" }}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-4 py-10 text-center">
      {icon && (
        <div
          className="grid h-12 w-12 place-items-center rounded-full"
          style={{ border: "1px solid var(--line)", color: "var(--gold)" }}
        >
          {icon}
        </div>
      )}
      <div>
        <p className="font-medium">{title}</p>
        {description && <p className="small muted mx-auto mt-1 max-w-sm">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function Callout({
  tone = "info",
  title,
  children,
}: {
  tone?: "info" | "warning" | "danger" | "success";
  title?: string;
  children: ReactNode;
}) {
  const palette = {
    info: { border: "var(--line)", bg: "rgba(255,255,255,0.03)", accent: "var(--muted)" },
    warning: { border: "rgba(232,182,91,0.42)", bg: "rgba(232,182,91,0.07)", accent: "var(--warning)" },
    danger: { border: "rgba(229,72,77,0.45)", bg: "rgba(229,72,77,0.07)", accent: "var(--danger)" },
    success: { border: "rgba(0,167,139,0.42)", bg: "rgba(0,167,139,0.07)", accent: "var(--accent)" },
  }[tone];

  return (
    <div
      className="rounded-2xl border px-4 py-3 text-sm"
      style={{ borderColor: palette.border, background: palette.bg }}
      role={tone === "danger" ? "alert" : undefined}
    >
      {title && (
        <p className="mb-1 font-semibold" style={{ color: palette.accent }}>
          {title}
        </p>
      )}
      <div className="med-prose small" style={{ color: "var(--text)" }}>
        {children}
      </div>
    </div>
  );
}

export function Skeleton({ className = "h-4 w-full" }: { className?: string }) {
  return <div className={`skeleton ${className}`} aria-hidden />;
}

export function Tabs<T extends string>({
  options,
  value,
  onChange,
  label,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  label: string;
}) {
  return (
    <div role="tablist" aria-label={label} className="flex flex-wrap gap-2">
      {options.map((option) => (
        <button
          key={option.value}
          role="tab"
          type="button"
          aria-selected={value === option.value}
          className="chip"
          data-active={value === option.value}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export function Disclaimer({ children }: { children: ReactNode }) {
  return (
    <p className="tiny muted mt-3 leading-relaxed" style={{ maxWidth: "78ch" }}>
      {children}
    </p>
  );
}

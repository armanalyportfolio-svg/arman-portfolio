"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import {
  ChevronDown,
  ChevronUp,
  Copy,
  FileUp,
  Loader2,
  Plus,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { uploadMedia } from "@/lib/admin/upload";

const inputClass =
  "w-full bg-[var(--bg-deep)] border border-[var(--border-subtle)] rounded-xl px-3.5 py-2.5 text-sm text-[var(--text-main)] placeholder-[var(--text-muted)]/60 focus:outline-none focus:border-[#5C5470] focus:ring-1 focus:ring-[#5C5470]/40 transition-colors";

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold text-[var(--text-main)] mb-1.5">{label}</span>
      {children}
      {hint && <span className="block text-[11px] text-[var(--text-muted)] mt-1.5">{hint}</span>}
    </label>
  );
}

export function TextInput({
  label,
  value,
  onChange,
  placeholder,
  hint,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  hint?: React.ReactNode;
  type?: "text" | "email" | "url" | "tel";
}) {
  return (
    <Field label={label} hint={hint}>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={inputClass}
      />
    </Field>
  );
}

export function TextArea({
  label,
  value,
  onChange,
  placeholder,
  hint,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  hint?: React.ReactNode;
  rows?: number;
}) {
  return (
    <Field label={label} hint={hint}>
      <textarea
        value={value}
        rows={rows}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={`${inputClass} resize-y leading-relaxed`}
      />
    </Field>
  );
}

export function NumberInput({
  label,
  value,
  onChange,
  min,
  max,
  hint,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  hint?: React.ReactNode;
}) {
  return (
    <Field label={label} hint={hint}>
      <input
        type="number"
        value={Number.isFinite(value) ? value : 0}
        min={min}
        max={max}
        onChange={(e) => onChange(e.target.value === "" ? 0 : Number(e.target.value))}
        className={inputClass}
      />
    </Field>
  );
}

export function RangeInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <Field label={`${label}: ${value}%`}>
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-[#857B9C]"
      />
    </Field>
  );
}

export function Select({
  label,
  value,
  onChange,
  options,
  hint,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  hint?: React.ReactNode;
}) {
  return (
    <Field label={label} hint={hint}>
      <select value={value} onChange={(e) => onChange(e.target.value)} className={inputClass}>
        {!options.some((o) => o.value === value) && <option value={value}>{value || "—"}</option>}
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </Field>
  );
}

export function Toggle({
  label,
  checked,
  onChange,
  hint,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  hint?: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <div className="text-xs font-semibold text-[var(--text-main)]">{label}</div>
        {hint && <div className="text-[11px] text-[var(--text-muted)] mt-0.5">{hint}</div>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={`relative w-11 h-6 rounded-full shrink-0 transition-colors cursor-pointer ${
          checked ? "bg-emerald-500" : "bg-[var(--bg-elevated)] border border-[var(--border-subtle)]"
        }`}
      >
        <span
          className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${
            checked ? "left-[22px]" : "left-0.5"
          }`}
        />
      </button>
    </div>
  );
}

// Chip-style editor for short string lists (tags, keywords, roles).
export function TagsInput({
  label,
  value,
  onChange,
  placeholder = "Type and press Enter",
  hint,
}: {
  label: string;
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  hint?: React.ReactNode;
}) {
  const [draft, setDraft] = useState("");

  const add = () => {
    const next = draft.trim();
    if (!next) return;
    if (!value.includes(next)) onChange([...value, next]);
    setDraft("");
  };

  return (
    <Field label={label} hint={hint}>
      <div className={`${inputClass} flex flex-wrap gap-1.5 items-center min-h-[44px]`}>
        {value.map((tag, i) => (
          <span
            key={`${tag}-${i}`}
            className="inline-flex items-center gap-1 pl-2.5 pr-1 py-0.5 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-xs"
          >
            {tag}
            <button
              type="button"
              onClick={() => onChange(value.filter((_, j) => j !== i))}
              className="p-0.5 rounded hover:bg-rose-500/20 hover:text-rose-400 cursor-pointer"
              aria-label={`Remove ${tag}`}
            >
              <X size={12} />
            </button>
          </span>
        ))}
        <input
          value={draft}
          placeholder={value.length ? "" : placeholder}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              add();
            } else if (e.key === "Backspace" && !draft && value.length) {
              onChange(value.slice(0, -1));
            }
          }}
          onBlur={add}
          className="flex-1 min-w-[120px] bg-transparent outline-none text-sm"
        />
      </div>
    </Field>
  );
}

// URL field with an upload button. Shows an image preview unless `accept` is a document type.
export function MediaInput({
  label,
  value,
  onChange,
  folder,
  accept = "image/*",
  hint,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  folder: string;
  accept?: string;
  hint?: React.ReactNode;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const isImage = accept.startsWith("image");

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadMedia(file, folder);
      onChange(url);
      toast.success("Uploaded");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <Field
      label={label}
      hint={hint ?? "Upload a file, or paste a /images/... path or an uploaded file URL."}
    >
      <div className="flex gap-3 items-start">
        {isImage && (
          <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-[var(--bg-deep)] border border-[var(--border-subtle)] shrink-0">
            {value ? (
              <Image src={value} alt="" fill unoptimized className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[10px] text-[var(--text-muted)]">
                No image
              </div>
            )}
          </div>
        )}
        <div className="flex-1 space-y-2 min-w-0">
          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={isImage ? "/images/example.jpg" : "/files/cv.pdf"}
            className={inputClass}
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#5C5470] text-white hover:bg-[#6d6484] disabled:opacity-60 cursor-pointer"
            >
              {uploading ? (
                <Loader2 size={13} className="animate-spin" />
              ) : isImage ? (
                <Upload size={13} />
              ) : (
                <FileUp size={13} />
              )}
              {uploading ? "Uploading..." : "Upload"}
            </button>
            {value && (
              <button
                type="button"
                onClick={() => onChange("")}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-rose-400 hover:border-rose-500/40 cursor-pointer"
              >
                <X size={13} /> Clear
              </button>
            )}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept={accept}
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
        </div>
      </div>
    </Field>
  );
}

// Reorderable list of collapsible cards with add / duplicate / delete.
export function ListEditor<T>({
  label,
  items,
  onChange,
  createItem,
  itemTitle,
  itemThumb,
  renderItem,
  addLabel = "Add item",
}: {
  label: string;
  items: T[];
  onChange: (items: T[]) => void;
  createItem: () => T;
  itemTitle: (item: T, index: number) => string;
  itemThumb?: (item: T) => string | undefined;
  renderItem: (item: T, update: (patch: Partial<T>) => void, index: number) => React.ReactNode;
  addLabel?: string;
}) {
  const [open, setOpen] = useState<number | null>(null);

  const update = (index: number, patch: Partial<T>) =>
    onChange(items.map((it, i) => (i === index ? { ...it, ...patch } : it)));

  const move = (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
    if (open === index) setOpen(target);
  };

  const remove = (index: number) => {
    if (!confirm(`Delete "${itemTitle(items[index], index)}"?`)) return;
    onChange(items.filter((_, i) => i !== index));
    setOpen(null);
  };

  const duplicate = (index: number) => {
    const next = [...items];
    next.splice(index + 1, 0, structuredClone(items[index]));
    onChange(next);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2.5">
        <span className="text-xs font-semibold text-[var(--text-main)]">
          {label} <span className="text-[var(--text-muted)] font-mono">({items.length})</span>
        </span>
      </div>

      <div className="space-y-2">
        {items.map((item, i) => {
          const isOpen = open === i;
          const thumb = itemThumb?.(item);
          return (
            <div
              key={i}
              className={`rounded-xl border transition-colors ${
                isOpen
                  ? "border-[#5C5470] bg-[var(--bg-deep)]/60"
                  : "border-[var(--border-subtle)] bg-[var(--bg-deep)]/30"
              }`}
            >
              <div className="flex items-center gap-2 px-3 py-2">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex-1 flex items-center gap-3 text-left min-w-0 cursor-pointer"
                >
                  {itemThumb && (
                    <span className="relative w-9 h-9 rounded-lg overflow-hidden bg-[var(--bg-elevated)] shrink-0">
                      {thumb && <Image src={thumb} alt="" fill unoptimized className="object-cover" />}
                    </span>
                  )}
                  <span className="text-xs font-mono text-[var(--text-muted)] w-5 shrink-0">{i + 1}.</span>
                  <span className="text-sm font-medium text-[var(--text-main)] truncate">
                    {itemTitle(item, i) || <em className="text-[var(--text-muted)]">Untitled</em>}
                  </span>
                </button>
                <div className="flex items-center gap-0.5 shrink-0">
                  <IconButton label="Move up" onClick={() => move(i, -1)} disabled={i === 0}>
                    <ChevronUp size={15} />
                  </IconButton>
                  <IconButton label="Move down" onClick={() => move(i, 1)} disabled={i === items.length - 1}>
                    <ChevronDown size={15} />
                  </IconButton>
                  <IconButton label="Duplicate" onClick={() => duplicate(i)}>
                    <Copy size={14} />
                  </IconButton>
                  <IconButton label="Delete" onClick={() => remove(i)} danger>
                    <Trash2 size={14} />
                  </IconButton>
                </div>
              </div>
              {isOpen && (
                <div className="px-4 pb-4 pt-2 space-y-4 border-t border-[var(--border-subtle)]">
                  {renderItem(item, (patch) => update(i, patch), i)}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => {
          onChange([...items, createItem()]);
          setOpen(items.length);
        }}
        className="mt-3 w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl border border-dashed border-[var(--border-subtle)] text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text-main)] hover:border-[#5C5470] transition-colors cursor-pointer"
      >
        <Plus size={14} /> {addLabel}
      </button>
    </div>
  );
}

function IconButton({
  label,
  onClick,
  disabled,
  danger,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className={`p-1.5 rounded-lg text-[var(--text-muted)] disabled:opacity-25 disabled:cursor-not-allowed cursor-pointer transition-colors ${
        danger ? "hover:text-rose-400 hover:bg-rose-500/10" : "hover:text-[var(--text-main)] hover:bg-[var(--bg-elevated)]"
      }`}
    >
      {children}
    </button>
  );
}

export function Card({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 sm:p-6">
      <div className="mb-5">
        <h3 className="font-display text-base font-bold text-[var(--text-main)]">{title}</h3>
        {description && <p className="text-xs text-[var(--text-muted)] mt-1">{description}</p>}
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

export function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid sm:grid-cols-2 gap-4">{children}</div>;
}

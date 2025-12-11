"use client";

import { X } from 'lucide-react';
import { useState } from 'react';

export default function WarrantyMessageBanner({
  status,
  message,
}: {
  status: 'success' | 'error' | undefined;
  message: string | undefined;
}) {
  const [visible, setVisible] = useState(true);

  if (!visible || !message || !status) return null;

  const baseClasses = "rounded-md border px-3 py-2 text-sm flex items-start justify-between gap-4";
  const variantClasses =
    status === 'success'
      ? "border-green-200 bg-green-50 text-green-800"
      : "border-red-200 bg-red-50 text-red-800";

  return (
    <div className={`${baseClasses} ${variantClasses}`}>
      <span>{message}</span>
      <button
        onClick={() => setVisible(false)}
        className="shrink-0 p-0.5 hover:bg-black/10 rounded transition-colors"
        aria-label="Dismiss message"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

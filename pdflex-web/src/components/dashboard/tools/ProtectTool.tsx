"use client";

import * as React from "react";
import { Upload, ShieldCheck } from "lucide-react";

export default function ProtectTool() {
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2">
        <span className="grid h-9 w-9 place-items-center rounded-full bg-[color:var(--fg)]/5 ring-1 ring-[color:var(--card-border)]/80">
          <ShieldCheck className="h-4 w-4" />
        </span>
        <div>
          <div className="font-semibold">Protect PDF</div>
          <div className="text-xs text-muted">Password, permissions & redaction</div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <label className="block">
          <span className="mb-1 block text-sm text-muted">Owner password</span>
          <input type="password" placeholder="••••••••" className="w-full" />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm text-muted">Open password</span>
          <input type="password" placeholder="••••••••" className="w-full" />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm text-muted">Allow printing</span>
          <select className="w-full">
            <option>Yes</option>
            <option>No</option>
          </select>
        </label>
      </div>

      <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)]/60 p-6 text-center">
        <div className="mx-auto flex max-w-xl flex-col itemscenter gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-full bg-[color:var(--fg)]/5 ring-1 ring-[color:var(--card-border)]/80">
            <Upload className="h-5 w-5" />
          </span>
          <div className="text-default font-medium">Drop PDF to protect</div>
          <div className="text-sm text-muted">or choose a file from disk</div>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <button className="btn btn-ghost">Cancel</button>
        <button className="btn btn-primary">Apply</button>
      </div>
    </div>
  );
}
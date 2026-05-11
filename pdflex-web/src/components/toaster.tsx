"use client";

import * as React from "react";

export type ToastKind = "success" | "error" | "info";

type ToastMsg = { id: number; kind: ToastKind; message: string };

let pushRef: ((t: ToastMsg) => void) | null = null;

/** Vyrenderuj raz v layout-e; tu sa zbierajú a zobrazujú toasty. */
export function ToasterHost() {
  const [items, setItems] = React.useState<ToastMsg[]>([]);

  React.useEffect(() => {
    pushRef = (t) => {
      setItems((s) => [...s, t]);
      // auto-dismiss po 3s
      window.setTimeout(() => {
        setItems((s) => s.filter((x) => x.id !== t.id));
      }, 3000);
    };
    return () => {
      pushRef = null;
    };
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-[100] space-y-2">
      {items.map((t) => (
        <div
          key={t.id}
          role="status"
          className={
            "rounded-md px-3 py-2 text-sm shadow " +
            (t.kind === "error"
              ? "bg-red-600 text-white"
              : t.kind === "success"
              ? "bg-emerald-600 text-white"
              : "bg-slate-800 text-white")
          }
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}

/** Jednoduché API na vyvolanie toastu kdekoľvek v appke. */
export const toast = {
  success(message: string) {
    pushRef?.({ id: Date.now() + Math.random(), kind: "success", message });
  },
  error(message: string) {
    pushRef?.({ id: Date.now() + Math.random(), kind: "error", message });
  },
  info(message: string) {
    pushRef?.({ id: Date.now() + Math.random(), kind: "info", message });
  },
};
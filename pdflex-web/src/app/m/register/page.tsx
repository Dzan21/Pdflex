"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/use-session";

export default function MobileRegisterPage() {
  const router = useRouter();
  const { authed, register } = useSession();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (authed) {
      router.replace("/dashboard");
    }
  }, [authed, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const result = await register({ email, password, name });
    if (result?.success) {
      router.push("/dashboard");
    } else {
      alert(result?.error || "Registrácia zlyhala");
    }
    setLoading(false);
  };

  if (authed === null) return null; // ⏳ Loading state

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6">
      <h1 className="text-2xl font-semibold mb-6">Registrácia</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        <input
          type="text"
          required
          placeholder="Meno"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 border rounded-md"
        />
        <input
          type="email"
          required
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 border rounded-md"
        />
        <input
          type="password"
          required
          placeholder="Heslo"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 border rounded-md"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[var(--brand-500)] text-white py-3 rounded-md font-medium"
        >
          {loading ? "Registrujem..." : "Registrovať sa"}
        </button>
      </form>
    </main>
  );
}
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Admin Login — Sultan Haramain" }] }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/admin" });
    });
  }, [navigate]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError(null); setInfo(null);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
        setInfo("Akun dibuat. Silakan login.");
        setMode("login");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: "/admin" });
      }
    } catch (err: any) {
      setError(err.message ?? "Terjadi kesalahan");
    } finally { setLoading(false); }
  }

  return (
    <div className="min-h-screen grid place-items-center bg-background px-4">
      <div className="w-full max-w-md rounded-3xl border border-gold/30 bg-card p-8 shadow-soft">
        <Link to="/" className="text-xs uppercase tracking-widest text-gold">← Kembali ke beranda</Link>
        <h1 className="mt-4 text-3xl font-semibold text-gradient-gold">Admin {mode === "login" ? "Login" : "Daftar"}</h1>
        <p className="mt-2 text-sm text-muted-foreground">Akses dashboard CMS Sultan Haramain.</p>
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <input type="email" required placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl bg-background border border-border px-4 py-3 outline-none focus:border-gold" />
          <input type="password" required minLength={6} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl bg-background border border-border px-4 py-3 outline-none focus:border-gold" />
          {error && <div className="text-sm text-red-400">{error}</div>}
          {info && <div className="text-sm text-emerald">{info}</div>}
          <button disabled={loading} className="w-full rounded-full bg-gradient-gold text-primary-foreground font-semibold py-3 shadow-gold disabled:opacity-50">
            {loading ? "Memproses..." : mode === "login" ? "Masuk" : "Daftar"}
          </button>
        </form>
        <button onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(null); setInfo(null); }}
          className="mt-4 text-sm text-gold hover:underline w-full text-center">
          {mode === "login" ? "Belum punya akun? Daftar" : "Sudah punya akun? Login"}
        </button>
      </div>
    </div>
  );
}
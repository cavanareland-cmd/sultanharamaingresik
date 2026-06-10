import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  checkIsAdmin, claimFirstAdmin, adminGetAll, adminUpsert, adminDelete, adminSaveSetting,
} from "@/lib/admin.functions";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Admin CMS — Sultan Haramain" }] }),
  component: AdminPage,
});

type Tab = "packages" | "faqs" | "advantages" | "payment_methods" | "gallery" | "settings";
const TAB_LABELS: Record<Tab, string> = {
  packages: "Paket", faqs: "FAQ", advantages: "Keunggulan",
  payment_methods: "Pembayaran", gallery: "Galeri", settings: "Pengaturan",
};

function AdminPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const checkFn = useServerFn(checkIsAdmin);
  const claimFn = useServerFn(claimFirstAdmin);
  const getAllFn = useServerFn(adminGetAll);

  const adminCheck = useQuery({ queryKey: ["isAdmin"], queryFn: () => checkFn() });
  const claim = useMutation({
    mutationFn: () => claimFn(),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["isAdmin"] }),
  });

  const [tab, setTab] = useState<Tab>("packages");

  const data = useQuery({
    queryKey: ["adminAll"],
    queryFn: () => getAllFn(),
    enabled: !!adminCheck.data?.isAdmin,
  });

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  }

  if (adminCheck.isLoading) return <div className="min-h-screen grid place-items-center text-muted-foreground">Memuat...</div>;

  if (!adminCheck.data?.isAdmin) {
    return (
      <div className="min-h-screen grid place-items-center px-4 bg-background">
        <div className="max-w-md text-center space-y-4">
          <h1 className="text-2xl font-semibold text-gradient-gold">Akses Admin Diperlukan</h1>
          {adminCheck.data?.canClaim ? (
            <>
              <p className="text-muted-foreground">Belum ada admin terdaftar. Klaim akses admin pertama untuk akun ini.</p>
              <button onClick={() => claim.mutate()} disabled={claim.isPending}
                className="rounded-full bg-gradient-gold text-primary-foreground font-semibold px-6 py-3 shadow-gold disabled:opacity-50">
                {claim.isPending ? "Memproses..." : "Klaim sebagai Admin"}
              </button>
              {claim.error && <div className="text-sm text-red-400">{(claim.error as Error).message}</div>}
            </>
          ) : (
            <p className="text-muted-foreground">Akun Anda bukan admin. Hubungi administrator.</p>
          )}
          <button onClick={signOut} className="text-sm text-gold hover:underline">Logout</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card/40 backdrop-blur-xl sticky top-0 z-10">
        <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="text-gradient-gold font-semibold">Sultan Haramain CMS</Link>
            <Link to="/" className="text-xs text-muted-foreground hover:text-gold">↗ Lihat Situs</Link>
          </div>
          <button onClick={signOut} className="text-sm text-gold hover:underline">Logout</button>
        </div>
        <div className="mx-auto max-w-7xl px-6 flex gap-1 overflow-x-auto">
          {(Object.keys(TAB_LABELS) as Tab[]).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-3 text-sm whitespace-nowrap border-b-2 transition-colors ${
                tab === t ? "border-gold text-gold" : "border-transparent text-muted-foreground hover:text-foreground"
              }`}>{TAB_LABELS[t]}</button>
          ))}
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        {data.isLoading && <div className="text-muted-foreground">Memuat data...</div>}
        {data.data && tab !== "settings" && (
          <TableEditor table={tab} rows={(data.data as any)[tab] ?? []} />
        )}
        {data.data && tab === "settings" && (
          <SettingsEditor settings={(data.data as any).settings ?? {}} />
        )}
      </main>
    </div>
  );
}

const FIELDS: Record<Exclude<Tab, "settings">, { key: string; label: string; type: "text" | "textarea" | "number" | "bool" | "list" }[]> = {
  packages: [
    { key: "tag", label: "Tag", type: "text" },
    { key: "title", label: "Judul", type: "text" },
    { key: "price", label: "Harga", type: "text" },
    { key: "dp", label: "DP", type: "text" },
    { key: "features", label: "Fitur (satu per baris)", type: "list" },
    { key: "featured", label: "Featured", type: "bool" },
    { key: "sort_order", label: "Urutan", type: "number" },
    { key: "is_active", label: "Aktif", type: "bool" },
  ],
  faqs: [
    { key: "question", label: "Pertanyaan", type: "text" },
    { key: "answer", label: "Jawaban", type: "textarea" },
    { key: "sort_order", label: "Urutan", type: "number" },
    { key: "is_active", label: "Aktif", type: "bool" },
  ],
  advantages: [
    { key: "icon", label: "Icon", type: "text" },
    { key: "title", label: "Judul", type: "text" },
    { key: "description", label: "Deskripsi", type: "textarea" },
    { key: "sort_order", label: "Urutan", type: "number" },
    { key: "is_active", label: "Aktif", type: "bool" },
  ],
  payment_methods: [
    { key: "icon", label: "Icon", type: "text" },
    { key: "title", label: "Judul", type: "text" },
    { key: "description", label: "Deskripsi", type: "textarea" },
    { key: "badge", label: "Badge (opsional)", type: "text" },
    { key: "sort_order", label: "Urutan", type: "number" },
    { key: "is_active", label: "Aktif", type: "bool" },
  ],
  gallery: [
    { key: "image_url", label: "URL Gambar", type: "text" },
    { key: "caption", label: "Caption", type: "text" },
    { key: "sort_order", label: "Urutan", type: "number" },
    { key: "is_active", label: "Aktif", type: "bool" },
  ],
};

function TableEditor({ table, rows }: { table: Exclude<Tab, "settings">; rows: any[] }) {
  const qc = useQueryClient();
  const upsertFn = useServerFn(adminUpsert);
  const deleteFn = useServerFn(adminDelete);
  const [editing, setEditing] = useState<any | null>(null);

  const save = useMutation({
    mutationFn: (row: any) => upsertFn({ data: { table, row } }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["adminAll"] }); setEditing(null); },
  });
  const del = useMutation({
    mutationFn: (id: string) => deleteFn({ data: { table, id } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["adminAll"] }),
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">{TAB_LABELS[table]} ({rows.length})</h2>
        <button onClick={() => setEditing({ is_active: true, sort_order: rows.length + 1 })}
          className="rounded-full bg-gradient-gold text-primary-foreground font-semibold px-5 py-2 text-sm shadow-gold">+ Tambah</button>
      </div>
      <div className="rounded-2xl border border-border bg-card divide-y divide-border">
        {rows.length === 0 && <div className="p-6 text-muted-foreground text-sm">Belum ada data.</div>}
        {rows.map((row) => (
          <div key={row.id} className="p-4 flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="font-medium truncate">{row.title ?? row.question ?? row.caption ?? row.image_url}</div>
              <div className="text-xs text-muted-foreground mt-1">
                #{row.sort_order} {row.is_active ? "· Aktif" : "· Nonaktif"}
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setEditing(row)} className="text-sm text-gold hover:underline">Edit</button>
              <button onClick={() => { if (confirm("Hapus item ini?")) del.mutate(row.id); }}
                className="text-sm text-red-400 hover:underline">Hapus</button>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <RowForm
          table={table}
          row={editing}
          onCancel={() => setEditing(null)}
          onSave={(r) => save.mutate(r)}
          saving={save.isPending}
          error={save.error ? (save.error as Error).message : null}
        />
      )}
    </div>
  );
}

function RowForm({ table, row, onCancel, onSave, saving, error }: {
  table: Exclude<Tab, "settings">; row: any; onCancel: () => void; onSave: (r: any) => void; saving: boolean; error: string | null;
}) {
  const [form, setForm] = useState<any>(() => ({ ...row }));
  function set(k: string, v: any) { setForm((f: any) => ({ ...f, [k]: v })); }

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 grid place-items-center p-4 overflow-auto">
      <div className="w-full max-w-2xl rounded-3xl border border-gold/30 bg-card p-6 my-8">
        <h3 className="text-xl font-semibold mb-4">{row.id ? "Edit" : "Tambah"} {TAB_LABELS[table]}</h3>
        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
          {FIELDS[table].map((f) => (
            <div key={f.key}>
              <label className="text-xs uppercase tracking-widest text-muted-foreground">{f.label}</label>
              {f.type === "text" && (
                <input value={form[f.key] ?? ""} onChange={(e) => set(f.key, e.target.value)}
                  className="mt-1 w-full rounded-xl bg-background border border-border px-3 py-2 outline-none focus:border-gold" />
              )}
              {f.type === "textarea" && (
                <textarea rows={4} value={form[f.key] ?? ""} onChange={(e) => set(f.key, e.target.value)}
                  className="mt-1 w-full rounded-xl bg-background border border-border px-3 py-2 outline-none focus:border-gold" />
              )}
              {f.type === "number" && (
                <input type="number" value={form[f.key] ?? 0} onChange={(e) => set(f.key, Number(e.target.value))}
                  className="mt-1 w-full rounded-xl bg-background border border-border px-3 py-2 outline-none focus:border-gold" />
              )}
              {f.type === "bool" && (
                <div className="mt-1"><label className="inline-flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={!!form[f.key]} onChange={(e) => set(f.key, e.target.checked)} />
                  <span className="text-sm">{form[f.key] ? "Ya" : "Tidak"}</span>
                </label></div>
              )}
              {f.type === "list" && (
                <textarea rows={5} value={(form[f.key] ?? []).join("\n")}
                  onChange={(e) => set(f.key, e.target.value.split("\n").map((s) => s.trim()).filter(Boolean))}
                  className="mt-1 w-full rounded-xl bg-background border border-border px-3 py-2 outline-none focus:border-gold font-mono text-sm" />
              )}
            </div>
          ))}
        </div>
        {error && <div className="mt-3 text-sm text-red-400">{error}</div>}
        <div className="mt-5 flex justify-end gap-3">
          <button onClick={onCancel} className="px-5 py-2 text-sm rounded-full border border-border hover:border-gold/50">Batal</button>
          <button onClick={() => onSave(form)} disabled={saving}
            className="px-5 py-2 text-sm rounded-full bg-gradient-gold text-primary-foreground font-semibold shadow-gold disabled:opacity-50">
            {saving ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </div>
    </div>
  );
}

function SettingsEditor({ settings }: { settings: Record<string, any> }) {
  const qc = useQueryClient();
  const saveFn = useServerFn(adminSaveSetting);
  const [drafts, setDrafts] = useState<Record<string, string>>(() =>
    Object.fromEntries(Object.entries(settings).map(([k, v]) => [k, JSON.stringify(v, null, 2)]))
  );
  useEffect(() => {
    setDrafts(Object.fromEntries(Object.entries(settings).map(([k, v]) => [k, JSON.stringify(v, null, 2)])));
  }, [settings]);

  const save = useMutation({
    mutationFn: ({ key, value }: { key: string; value: any }) => saveFn({ data: { key, value } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["adminAll"] }),
  });

  const keys = Object.keys(drafts);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Pengaturan Situs</h2>
      <p className="text-sm text-muted-foreground">
        Edit JSON di bawah lalu Simpan. Pastikan format JSON valid (hero, about, contact, stats).
      </p>
      {keys.map((key) => (
        <div key={key} className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="font-semibold text-gold uppercase tracking-widest text-sm">{key}</div>
            <button onClick={() => {
              try {
                const value = JSON.parse(drafts[key]);
                save.mutate({ key, value });
              } catch { alert("JSON tidak valid"); }
            }} disabled={save.isPending}
              className="px-4 py-1.5 text-xs rounded-full bg-gradient-gold text-primary-foreground font-semibold shadow-gold disabled:opacity-50">
              {save.isPending ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
          <textarea rows={10} value={drafts[key]}
            onChange={(e) => setDrafts({ ...drafts, [key]: e.target.value })}
            className="w-full rounded-xl bg-background border border-border px-3 py-2 outline-none focus:border-gold font-mono text-xs" />
        </div>
      ))}
    </div>
  );
}
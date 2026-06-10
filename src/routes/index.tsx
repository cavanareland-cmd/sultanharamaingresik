import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import kaabaHero from "@/assets/kaaba-hero.jpg";
import madinah from "@/assets/madinah.jpg";
import jamaah from "@/assets/jamaah.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PT Sultan Barokah Haramain — Umroh & Haji Resmi Gresik" },
      { name: "description", content: "Penyelenggara resmi Umroh & Haji. Cukup bayar 8 juta-an langsung berangkat, pulangnya baru bayar. Akad syariah, tanpa jaminan." },
      { property: "og:title", content: "PT Sultan Barokah Haramain — Umroh & Haji Resmi" },
      { property: "og:description", content: "Langkah mudah menuju Baitullah. Cash, tabungan, atau cicilan tanpa jaminan." },
    ],
  }),
  component: Index,
});

function Index() {
  const [scrolled, setScrolled] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const nav = [
    { href: "#tentang", label: "Tentang" },
    { href: "#paket", label: "Paket" },
    { href: "#pembayaran", label: "Pembayaran" },
    { href: "#keunggulan", label: "Keunggulan" },
    { href: "#galeri", label: "Galeri" },
    { href: "#kontak", label: "Kontak" },
  ];

  const paket = [
    {
      tag: "Umroh Reguler",
      title: "Umroh 9 Hari",
      price: "Rp 28.500.000",
      dp: "DP 8 jt-an",
      features: ["Hotel bintang 4 dekat Masjidil Haram", "Pesawat Direct / 1x Transit", "City Tour Makkah & Madinah", "Muthawif berpengalaman"],
      featured: false,
    },
    {
      tag: "Paling Diminati",
      title: "Umroh Plus Turki",
      price: "Rp 36.900.000",
      dp: "DP 8 jt-an",
      features: ["12 Hari perjalanan berkah", "Hotel bintang 5 Makkah & Madinah", "Tour Istanbul 3 hari", "Manasik & perlengkapan lengkap"],
      featured: true,
    },
    {
      tag: "Haji Khusus",
      title: "Haji Plus 2026",
      price: "Mulai $11.500",
      dp: "Akad syariah",
      features: ["Kuota resmi Kemenag", "Hotel terdekat Masjidil Haram", "Bimbingan ustadz pembimbing", "Tenda VIP Mina & Arafah"],
      featured: false,
    },
  ];

  const keunggulan = [
    { icon: "✓", title: "Resmi & Berizin", desc: "PPIU No. 04042300022560003 — terdaftar SISKO PATUH Kemenag RI." },
    { icon: "☾", title: "Akad Syariah", desc: "Tanpa jaminan, tanpa riba. Semua proses sesuai prinsip syariah biar berkah." },
    { icon: "✈", title: "Berangkat Pasti", desc: "Pembimbing berpengalaman, jadwal terjamin, dan layanan penuh sejak manasik." },
    { icon: "♥", title: "Pelayanan Penuh Hati", desc: "Tim mendampingi jamaah mulai pendaftaran hingga kepulangan ke tanah air." },
  ];

  const faqs = [
    { q: "Apa benar cukup bayar 8 juta langsung berangkat?", a: "Benar. Dengan skema cicilan tanpa jaminan, Anda cukup membayar DP sekitar 8 juta-an, berangkat ke Tanah Suci, lalu pelunasan dilakukan setelah pulang." },
    { q: "Apakah PT Sultan Barokah Haramain sudah berizin resmi?", a: "Ya. Kami terdaftar resmi sebagai PPIU dengan No. Izin 04042300022560003 dan tergabung dalam SISKO PATUH Kemenag RI." },
    { q: "Apa saja sistem pembayaran yang tersedia?", a: "Tersedia tiga skema: Cash, Tabungan bertahap, dan Cicilan Tanpa Jaminan dengan akad syariah." },
    { q: "Apakah jamaah didampingi muthawif & pembimbing ibadah?", a: "Tentu. Setiap rombongan didampingi muthawif berpengalaman dan ustadz pembimbing manasik sejak di tanah air." },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled ? "backdrop-blur-xl bg-background/80 border-b border-border/60" : "bg-transparent"
        }`}
      >
        <div className="mx-auto max-w-7xl px-6 h-20 flex items-center justify-between">
          <a href="#top" className="flex items-center gap-3">
            <div className="size-10 rounded-full bg-gradient-gold grid place-items-center text-primary-foreground font-bold shadow-gold">
              ☪
            </div>
            <div className="leading-tight">
              <div className="text-lg text-gradient-gold font-semibold">Sultan Barokah</div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Haramain · Gresik</div>
            </div>
          </a>
          <nav className="hidden lg:flex items-center gap-8 text-sm">
            {nav.map((n) => (
              <a key={n.href} href={n.href} className="text-foreground/80 hover:text-gold transition-colors">
                {n.label}
              </a>
            ))}
          </nav>
          <a
            href="#kontak"
            className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold bg-gradient-gold text-primary-foreground shadow-gold hover:scale-105 transition-transform"
          >
            Daftar Sekarang
          </a>
        </div>
      </header>

      <section id="top" className="relative min-h-screen flex items-center overflow-hidden bg-gradient-hero">
        <img
          src={kaabaHero}
          alt="Kaaba Masjidil Haram"
          className="absolute inset-0 size-full object-cover opacity-40"
          width={1920}
          height={1280}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/40 to-background" />
        <div className="absolute -top-20 -left-20 size-[400px] rounded-full bg-gold/10 blur-[100px]" />
        <div className="absolute bottom-0 right-0 size-[500px] rounded-full bg-emerald/15 blur-[120px]" />

        <div className="relative mx-auto max-w-7xl px-6 pt-32 pb-20 grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 animate-fade-up">
            <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-card/60 px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-gold">
              <span className="size-1.5 rounded-full bg-gold animate-pulse-glow" />
              Penyelenggara Resmi · Izin PPIU 04042300022560003
            </div>
            <h1 className="mt-6 text-5xl md:text-7xl font-semibold leading-[1.05]">
              Langkah Mudah Menuju
              <span className="block text-gradient-gold italic">Baitullah.</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-xl">
              PT Sultan Barokah Haramain — penyelenggara resmi Umroh & Haji dengan akad syariah.
              Proses yang aman, amanah, dan terpercaya untuk perjalanan ibadah terbaikmu.
            </p>

            <div className="mt-8 inline-block relative">
              <div className="absolute inset-0 bg-highlight rounded-2xl -rotate-1" />
              <div className="relative bg-highlight text-emerald-deep rounded-2xl px-6 py-4 font-bold text-lg md:text-xl">
                Cukup bayar <span className="underline decoration-wavy">8 juta-an</span> langsung berangkat,
                <br className="hidden md:block" /> pulangnya baru bayar.
              </div>
            </div>

            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href="#paket"
                className="rounded-full px-7 py-3.5 bg-gradient-gold text-primary-foreground font-semibold shadow-gold hover:scale-105 transition-transform"
              >
                Lihat Paket
              </a>
              <a
                href="#kontak"
                className="rounded-full px-7 py-3.5 border border-gold/50 text-gold hover:bg-gold/10 transition-colors font-semibold"
              >
                Konsultasi Gratis
              </a>
            </div>

            <div className="mt-12 grid grid-cols-3 gap-6 max-w-md">
              {[
                { n: "1,200+", l: "Jamaah Berangkat" },
                { n: "12+", l: "Tahun Pengalaman" },
                { n: "100%", l: "Akad Syariah" },
              ].map((s) => (
                <div key={s.l}>
                  <div className="text-3xl text-gradient-gold font-semibold">{s.n}</div>
                  <div className="text-xs text-muted-foreground mt-1">{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 relative hidden lg:block">
            <div className="relative animate-float">
              <div className="absolute -inset-4 bg-gradient-gold rounded-[2.5rem] blur-2xl opacity-30" />
              <div className="relative rounded-[2rem] overflow-hidden border border-gold/30 shadow-gold">
                <img src={jamaah} alt="Jamaah Sultan Haramain" className="w-full h-[520px] object-cover" width={1024} height={1024} />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="text-xs uppercase tracking-widest text-gold">Bersama jamaah kami</div>
                  <div className="text-xl mt-1">"Pengalaman umroh yang penuh berkah."</div>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-6 -left-6 bg-card border border-gold/30 rounded-2xl p-4 shadow-soft animate-float" style={{ animationDelay: "1s" }}>
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-gradient-emerald grid place-items-center text-cream">★</div>
                <div>
                  <div className="text-sm font-semibold">5 Pasti Umrah</div>
                  <div className="text-xs text-muted-foreground">Tersertifikasi Kemenag</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="tentang" className="relative py-28">
        <div className="mx-auto max-w-7xl px-6 grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-emerald rounded-[2rem] blur-3xl opacity-20" />
            <img src={madinah} alt="Masjid Nabawi" className="relative rounded-[2rem] w-full h-[480px] object-cover border border-gold/20" loading="lazy" width={1280} height={960} />
            <div className="absolute -bottom-8 -right-8 bg-card border border-gold/30 rounded-2xl p-6 max-w-xs shadow-soft">
              <div className="text-xs uppercase tracking-widest text-gold mb-2">Tanpa Jaminan</div>
              <div className="text-2xl">Akad syariah biar berkah</div>
            </div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-[0.25em] text-gold">Tentang Kami</div>
            <h2 className="mt-3 text-4xl md:text-5xl font-semibold">
              Mengantar Anda ke Tanah Suci dengan <span className="text-gradient-gold italic">amanah.</span>
            </h2>
            <p className="mt-6 text-muted-foreground leading-relaxed">
              PT Sultan Barokah Haramain adalah penyelenggara perjalanan Umroh dan Haji resmi
              berbasis di Gresik. Berbekal pengalaman bertahun-tahun, kami berkomitmen menghadirkan
              pelayanan terbaik bagi setiap tamu Allah — mulai dari pendaftaran, manasik,
              keberangkatan, hingga kembali ke tanah air dengan selamat.
            </p>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Seluruh proses kami jalankan dengan akad syariah, tanpa riba, dan tanpa jaminan —
              sehingga ibadah Anda tetap bersih dan berkah dari awal hingga akhir.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-4">
              {[
                ["Izin PPIU", "04042300022560003"],
                ["Sertifikasi", "SISKO PATUH"],
                ["Akad", "100% Syariah"],
                ["Basis", "Gresik, Jawa Timur"],
              ].map(([k, v]) => (
                <div key={k} className="rounded-2xl border border-border bg-card/60 p-4">
                  <div className="text-xs uppercase tracking-widest text-muted-foreground">{k}</div>
                  <div className="mt-1 font-semibold text-gold">{v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="paket" className="py-28 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-secondary/30 to-transparent" />
        <div className="relative mx-auto max-w-7xl px-6">
          <div className="text-center max-w-2xl mx-auto">
            <div className="text-xs uppercase tracking-[0.25em] text-gold">Paket Perjalanan</div>
            <h2 className="mt-3 text-4xl md:text-5xl font-semibold">
              Pilih paket <span className="text-gradient-gold italic">terbaik</span> untuk perjalananmu
            </h2>
            <p className="mt-4 text-muted-foreground">
              Tiga pilihan paket Umroh & Haji dengan fasilitas premium dan harga transparan.
            </p>
          </div>

          <div className="mt-16 grid md:grid-cols-3 gap-6">
            {paket.map((p) => (
              <div
                key={p.title}
                className={`group relative rounded-3xl p-8 border transition-all duration-500 hover:-translate-y-2 ${
                  p.featured
                    ? "bg-gradient-to-b from-gold/15 to-card border-gold/50 shadow-gold"
                    : "bg-card border-border hover:border-gold/40"
                }`}
              >
                {p.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-gold px-4 py-1 text-[10px] uppercase tracking-widest text-primary-foreground font-bold">
                    {p.tag}
                  </div>
                )}
                {!p.featured && (
                  <div className="text-xs uppercase tracking-widest text-gold mb-3">{p.tag}</div>
                )}
                <h3 className="text-3xl font-semibold">{p.title}</h3>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-gradient-gold">{p.price}</span>
                </div>
                <div className="mt-1 text-sm text-emerald">{p.dp}</div>
                <ul className="mt-6 space-y-3 text-sm">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-3">
                      <span className="mt-0.5 size-5 rounded-md bg-gold/15 text-gold grid place-items-center text-xs">✓</span>
                      <span className="text-foreground/85">{f}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href="#kontak"
                  className={`mt-8 inline-flex w-full justify-center rounded-full py-3 font-semibold transition-all ${
                    p.featured
                      ? "bg-gradient-gold text-primary-foreground shadow-gold"
                      : "border border-gold/40 text-gold hover:bg-gold/10"
                  }`}
                >
                  Pilih Paket
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pembayaran" className="py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5">
              <div className="text-xs uppercase tracking-[0.25em] text-gold">Sistem Pembayaran</div>
              <h2 className="mt-3 text-4xl md:text-5xl font-semibold">
                Tiga cara <span className="text-gradient-gold italic">fleksibel</span> untuk berangkat
              </h2>
              <p className="mt-6 text-muted-foreground">
                Kami memahami setiap jamaah punya kemampuan finansial yang berbeda. Karena itu kami
                menyediakan tiga skema pembayaran agar siapa pun bisa segera memenuhi panggilan-Nya.
              </p>
              <div className="mt-8 inline-flex items-center gap-3 rounded-2xl border border-emerald/40 bg-emerald/10 px-5 py-4">
                <span className="text-2xl">☾</span>
                <span className="text-sm text-cream/90">Semua skema berlandaskan akad syariah.</span>
              </div>
            </div>
            <div className="lg:col-span-7 grid sm:grid-cols-2 gap-5">
              {[
                { icon: "💵", title: "Cash", desc: "Pembayaran lunas di muka dengan harga terbaik dan bonus eksklusif." },
                { icon: "🏦", title: "Tabungan", desc: "Menabung bertahap sesuai kemampuan hingga mencapai target keberangkatan." },
                { icon: "✨", title: "Cicilan Tanpa Jaminan", desc: "Cukup bayar 8 juta-an, langsung berangkat. Pelunasan setelah pulang.", badge: "Favorit" },
                { icon: "🤝", title: "Akad Syariah", desc: "Setiap transaksi disertai akad jelas dan transparan sesuai syariat Islam." },
              ].map((c) => (
                <div key={c.title} className="group relative rounded-2xl border border-border bg-card p-6 hover:border-gold/50 transition-colors">
                  {c.badge && (
                    <div className="absolute top-4 right-4 rounded-full bg-highlight text-emerald-deep text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider">
                      {c.badge}
                    </div>
                  )}
                  <div className="text-3xl">{c.icon}</div>
                  <div className="mt-4 font-semibold text-lg text-gold">{c.title}</div>
                  <p className="mt-2 text-sm text-muted-foreground">{c.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="keunggulan" className="py-28 relative">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center max-w-2xl mx-auto">
            <div className="text-xs uppercase tracking-[0.25em] text-gold">Mengapa Sultan Haramain</div>
            <h2 className="mt-3 text-4xl md:text-5xl font-semibold">
              Proses yang <span className="text-gradient-gold italic">aman</span> dan{" "}
              <span className="text-gradient-gold italic">terpercaya</span>
            </h2>
          </div>
          <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {keunggulan.map((k, i) => (
              <div
                key={k.title}
                className="group relative rounded-3xl border border-border bg-card p-8 hover:border-gold/50 hover:-translate-y-1 transition-all"
              >
                <div className="size-14 rounded-2xl bg-gradient-gold grid place-items-center text-2xl text-primary-foreground shadow-gold">
                  {k.icon}
                </div>
                <h3 className="mt-6 text-xl font-semibold">{k.title}</h3>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{k.desc}</p>
                <div className="absolute top-6 right-6 text-5xl text-gold/10 group-hover:text-gold/20 transition-colors">
                  0{i + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="galeri" className="py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <div className="text-xs uppercase tracking-[0.25em] text-gold">Galeri Jamaah</div>
              <h2 className="mt-3 text-4xl md:text-5xl font-semibold">
                Momen <span className="text-gradient-gold italic">berkah</span> di Tanah Suci
              </h2>
            </div>
            <p className="text-muted-foreground max-w-md">
              Setiap senyum adalah cerita perjalanan spiritual yang tak terlupakan bersama Sultan Haramain.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[kaabaHero, jamaah, madinah, kaabaHero, jamaah, madinah, kaabaHero, jamaah].map((src, i) => (
              <div
                key={i}
                className={`relative overflow-hidden rounded-2xl border border-gold/20 group ${
                  i === 0 || i === 5 ? "md:col-span-2 md:row-span-2" : ""
                }`}
                style={{ aspectRatio: i === 0 || i === 5 ? "1 / 1" : "3 / 4" }}
              >
                <img
                  src={src}
                  alt="Jamaah Sultan Haramain"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  loading="lazy"
                  width={800}
                  height={800}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-28">
        <div className="mx-auto max-w-4xl px-6">
          <div className="text-center">
            <div className="text-xs uppercase tracking-[0.25em] text-gold">Pertanyaan Umum</div>
            <h2 className="mt-3 text-4xl md:text-5xl font-semibold">
              Yang sering <span className="text-gradient-gold italic">ditanyakan</span>
            </h2>
          </div>
          <div className="mt-12 space-y-4">
            {faqs.map((f, i) => (
              <button
                key={i}
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full text-left rounded-2xl border border-border bg-card p-6 hover:border-gold/40 transition-colors"
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="font-semibold text-lg">{f.q}</span>
                  <span className={`text-gold text-2xl transition-transform duration-300 ${openFaq === i ? "rotate-45" : ""}`}>+</span>
                </div>
                <div className={`grid transition-all duration-300 ${openFaq === i ? "grid-rows-[1fr] opacity-100 mt-4" : "grid-rows-[0fr] opacity-0"}`}>
                  <div className="overflow-hidden text-muted-foreground">{f.a}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section id="kontak" className="py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="relative overflow-hidden rounded-[2.5rem] border border-gold/30 bg-gradient-to-br from-card via-background to-card p-10 md:p-16">
            <div className="absolute -top-32 -right-32 size-[400px] rounded-full bg-gold/15 blur-[100px]" />
            <div className="absolute -bottom-32 -left-32 size-[400px] rounded-full bg-emerald/20 blur-[100px]" />

            <div className="relative grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="text-xs uppercase tracking-[0.25em] text-gold">Siap Berangkat?</div>
                <h2 className="mt-3 text-4xl md:text-5xl font-semibold leading-tight">
                  Mulai langkah pertama menuju <span className="text-gradient-gold italic">Baitullah</span> hari ini.
                </h2>
                <p className="mt-5 text-muted-foreground">
                  Hubungi tim kami untuk konsultasi gratis dan dapatkan rekomendasi paket terbaik
                  sesuai kebutuhanmu.
                </p>

                <div className="mt-8 space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="size-10 rounded-xl bg-gold/15 text-gold grid place-items-center">📍</div>
                    <div>
                      <div className="text-sm text-muted-foreground">Alamat Kantor</div>
                      <div className="font-medium">Jl. Samanhudin No. 37, Bedilan, Kec. Gresik, Kabupaten Gresik</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="size-10 rounded-xl bg-gold/15 text-gold grid place-items-center">🌐</div>
                    <div>
                      <div className="text-sm text-muted-foreground">Website</div>
                      <div className="font-medium">sultanharamaingresik.com</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="size-10 rounded-xl bg-gold/15 text-gold grid place-items-center">📱</div>
                    <div>
                      <div className="text-sm text-muted-foreground">Sosial Media</div>
                      <div className="font-medium">@sultanharamaingresik · Instagram · TikTok</div>
                    </div>
                  </div>
                </div>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  alert("Terima kasih! Tim kami akan menghubungi Anda segera.");
                }}
                className="rounded-3xl border border-border bg-background/60 backdrop-blur-xl p-8 space-y-4"
              >
                <h3 className="text-2xl font-semibold">Konsultasi Gratis</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <input required placeholder="Nama lengkap" className="w-full rounded-xl bg-card border border-border px-4 py-3 outline-none focus:border-gold transition" />
                  <input required type="tel" placeholder="No. WhatsApp" className="w-full rounded-xl bg-card border border-border px-4 py-3 outline-none focus:border-gold transition" />
                </div>
                <select className="w-full rounded-xl bg-card border border-border px-4 py-3 outline-none focus:border-gold transition">
                  <option>Pilih Paket</option>
                  <option>Umroh 9 Hari</option>
                  <option>Umroh Plus Turki</option>
                  <option>Haji Plus 2026</option>
                </select>
                <textarea placeholder="Pesan (opsional)" rows={3} className="w-full rounded-xl bg-card border border-border px-4 py-3 outline-none focus:border-gold transition" />
                <button type="submit" className="w-full rounded-full bg-gradient-gold text-primary-foreground font-semibold py-3.5 shadow-gold hover:scale-[1.02] transition-transform">
                  Kirim & Hubungi Saya
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-border py-12 mt-10">
        <div className="mx-auto max-w-7xl px-6 grid md:grid-cols-3 gap-8 items-center">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-full bg-gradient-gold grid place-items-center text-primary-foreground font-bold">☪</div>
            <div>
              <div className="text-gradient-gold font-semibold">PT Sultan Barokah Haramain</div>
              <div className="text-xs text-muted-foreground">Penyelenggara Umroh & Haji Resmi</div>
            </div>
          </div>
          <div className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Sultan Haramain Gresik. All rights reserved.
          </div>
          <div className="md:text-right text-xs text-muted-foreground">
            Izin PPIU 04042300022560003 · SISKO PATUH Kemenag RI
          </div>
        </div>
      </footer>
    </div>
  );
}
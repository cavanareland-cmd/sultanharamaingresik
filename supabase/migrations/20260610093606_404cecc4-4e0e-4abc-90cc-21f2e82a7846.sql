
-- ============= ROLES =============
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "users read own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "admins read all roles" ON public.user_roles FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins manage roles" ON public.user_roles FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============= shared updated_at trigger =============
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

-- ============= PACKAGES =============
CREATE TABLE public.packages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tag TEXT NOT NULL,
  title TEXT NOT NULL,
  price TEXT NOT NULL,
  dp TEXT NOT NULL,
  features TEXT[] NOT NULL DEFAULT '{}',
  featured BOOLEAN NOT NULL DEFAULT false,
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.packages TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.packages TO authenticated;
GRANT ALL ON public.packages TO service_role;
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read active packages" ON public.packages FOR SELECT TO anon, authenticated USING (is_active = true OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins manage packages" ON public.packages FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_packages_updated BEFORE UPDATE ON public.packages FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============= FAQS =============
CREATE TABLE public.faqs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.faqs TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.faqs TO authenticated;
GRANT ALL ON public.faqs TO service_role;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read active faqs" ON public.faqs FOR SELECT TO anon, authenticated USING (is_active = true OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins manage faqs" ON public.faqs FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_faqs_updated BEFORE UPDATE ON public.faqs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============= ADVANTAGES =============
CREATE TABLE public.advantages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  icon TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.advantages TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.advantages TO authenticated;
GRANT ALL ON public.advantages TO service_role;
ALTER TABLE public.advantages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read active advantages" ON public.advantages FOR SELECT TO anon, authenticated USING (is_active = true OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins manage advantages" ON public.advantages FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_advantages_updated BEFORE UPDATE ON public.advantages FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============= PAYMENT METHODS =============
CREATE TABLE public.payment_methods (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  icon TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  badge TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.payment_methods TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.payment_methods TO authenticated;
GRANT ALL ON public.payment_methods TO service_role;
ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read active payment_methods" ON public.payment_methods FOR SELECT TO anon, authenticated USING (is_active = true OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins manage payment_methods" ON public.payment_methods FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_pm_updated BEFORE UPDATE ON public.payment_methods FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============= GALLERY =============
CREATE TABLE public.gallery (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url TEXT NOT NULL,
  caption TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.gallery TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.gallery TO authenticated;
GRANT ALL ON public.gallery TO service_role;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read active gallery" ON public.gallery FOR SELECT TO anon, authenticated USING (is_active = true OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins manage gallery" ON public.gallery FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_gallery_updated BEFORE UPDATE ON public.gallery FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============= SITE SETTINGS =============
CREATE TABLE public.site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_settings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read settings" ON public.site_settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "admins manage settings" ON public.site_settings FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_settings_updated BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============= SEED DATA =============
INSERT INTO public.packages (tag, title, price, dp, features, featured, sort_order) VALUES
('Umroh Reguler', 'Umroh 9 Hari', 'Rp 28.500.000', 'DP 8 jt-an', ARRAY['Hotel bintang 4 dekat Masjidil Haram','Pesawat Direct / 1x Transit','City Tour Makkah & Madinah','Muthawif berpengalaman'], false, 1),
('Paling Diminati', 'Umroh Plus Turki', 'Rp 36.900.000', 'DP 8 jt-an', ARRAY['12 Hari perjalanan berkah','Hotel bintang 5 Makkah & Madinah','Tour Istanbul 3 hari','Manasik & perlengkapan lengkap'], true, 2),
('Haji Khusus', 'Haji Plus 2026', 'Mulai $11.500', 'Akad syariah', ARRAY['Kuota resmi Kemenag','Hotel terdekat Masjidil Haram','Bimbingan ustadz pembimbing','Tenda VIP Mina & Arafah'], false, 3);

INSERT INTO public.faqs (question, answer, sort_order) VALUES
('Apa benar cukup bayar 8 juta langsung berangkat?', 'Benar. Dengan skema cicilan tanpa jaminan, Anda cukup membayar DP sekitar 8 juta-an, berangkat ke Tanah Suci, lalu pelunasan dilakukan setelah pulang.', 1),
('Apakah PT Sultan Barokah Haramain sudah berizin resmi?', 'Ya. Kami terdaftar resmi sebagai PPIU dengan No. Izin 04042300022560003 dan tergabung dalam SISKO PATUH Kemenag RI.', 2),
('Apa saja sistem pembayaran yang tersedia?', 'Tersedia tiga skema: Cash, Tabungan bertahap, dan Cicilan Tanpa Jaminan dengan akad syariah.', 3),
('Apakah jamaah didampingi muthawif & pembimbing ibadah?', 'Tentu. Setiap rombongan didampingi muthawif berpengalaman dan ustadz pembimbing manasik sejak di tanah air.', 4);

INSERT INTO public.advantages (icon, title, description, sort_order) VALUES
('✓', 'Resmi & Berizin', 'PPIU No. 04042300022560003 — terdaftar SISKO PATUH Kemenag RI.', 1),
('☾', 'Akad Syariah', 'Tanpa jaminan, tanpa riba. Semua proses sesuai prinsip syariah biar berkah.', 2),
('✈', 'Berangkat Pasti', 'Pembimbing berpengalaman, jadwal terjamin, dan layanan penuh sejak manasik.', 3),
('♥', 'Pelayanan Penuh Hati', 'Tim mendampingi jamaah mulai pendaftaran hingga kepulangan ke tanah air.', 4);

INSERT INTO public.payment_methods (icon, title, description, badge, sort_order) VALUES
('💵', 'Cash', 'Pembayaran lunas di muka dengan harga terbaik dan bonus eksklusif.', NULL, 1),
('🏦', 'Tabungan', 'Menabung bertahap sesuai kemampuan hingga mencapai target keberangkatan.', NULL, 2),
('✨', 'Cicilan Tanpa Jaminan', 'Cukup bayar 8 juta-an, langsung berangkat. Pelunasan setelah pulang.', 'Favorit', 3),
('🤝', 'Akad Syariah', 'Setiap transaksi disertai akad jelas dan transparan sesuai syariat Islam.', NULL, 4);

INSERT INTO public.site_settings (key, value) VALUES
('hero', '{"badge":"Penyelenggara Resmi · Izin PPIU 04042300022560003","title_line1":"Langkah Mudah Menuju","title_line2":"Baitullah.","subtitle":"PT Sultan Barokah Haramain — penyelenggara resmi Umroh & Haji dengan akad syariah. Proses yang aman, amanah, dan terpercaya untuk perjalanan ibadah terbaikmu.","highlight":"Cukup bayar 8 juta-an langsung berangkat, pulangnya baru bayar."}'::jsonb),
('stats', '[{"n":"1,200+","l":"Jamaah Berangkat"},{"n":"12+","l":"Tahun Pengalaman"},{"n":"100%","l":"Akad Syariah"}]'::jsonb),
('contact', '{"whatsapp":"6281234567890","phone":"+62 812-3456-7890","email":"info@sultanharamain.com","address":"Gresik, Jawa Timur","instagram":"@sultanharamain"}'::jsonb),
('about', '{"title":"Mengantar Anda ke Tanah Suci dengan amanah.","paragraph1":"PT Sultan Barokah Haramain adalah penyelenggara perjalanan Umroh dan Haji resmi berbasis di Gresik. Berbekal pengalaman bertahun-tahun, kami berkomitmen menghadirkan pelayanan terbaik bagi setiap tamu Allah — mulai dari pendaftaran, manasik, keberangkatan, hingga kembali ke tanah air dengan selamat.","paragraph2":"Seluruh proses kami jalankan dengan akad syariah, tanpa riba, dan tanpa jaminan — sehingga ibadah Anda tetap bersih dan berkah dari awal hingga akhir.","facts":[["Izin PPIU","04042300022560003"],["Sertifikasi","SISKO PATUH"],["Akad","100% Syariah"],["Basis","Gresik, Jawa Timur"]]}'::jsonb);

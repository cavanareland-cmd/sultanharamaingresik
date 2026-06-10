import { createServerFn } from "@tanstack/react-start";

export type Pkg = {
  id: string;
  tag: string;
  title: string;
  price: string;
  dp: string;
  features: string[];
  featured: boolean;
  sort_order: number;
  is_active: boolean;
};
export type Faq = { id: string; question: string; answer: string; sort_order: number; is_active: boolean };
export type Advantage = { id: string; icon: string; title: string; description: string; sort_order: number; is_active: boolean };
export type PaymentMethod = { id: string; icon: string; title: string; description: string; badge: string | null; sort_order: number; is_active: boolean };
export type GalleryItem = { id: string; image_url: string; caption: string | null; sort_order: number; is_active: boolean };

type JsonValue = string | number | boolean | null | JsonValue[] | { [k: string]: JsonValue };
export type CmsContent = {
  packages: Pkg[];
  faqs: Faq[];
  advantages: Advantage[];
  payment_methods: PaymentMethod[];
  gallery: GalleryItem[];
  settings: Record<string, JsonValue>;
};

export const getCmsContent = createServerFn({ method: "GET" }).handler(async (): Promise<CmsContent> => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

  const [pkgs, faqs, adv, pm, gal, set] = await Promise.all([
    supabaseAdmin.from("packages").select("*").eq("is_active", true).order("sort_order"),
    supabaseAdmin.from("faqs").select("*").eq("is_active", true).order("sort_order"),
    supabaseAdmin.from("advantages").select("*").eq("is_active", true).order("sort_order"),
    supabaseAdmin.from("payment_methods").select("*").eq("is_active", true).order("sort_order"),
    supabaseAdmin.from("gallery").select("*").eq("is_active", true).order("sort_order"),
    supabaseAdmin.from("site_settings").select("*"),
  ]);

  const settings: Record<string, JsonValue> = {};
  for (const row of set.data ?? []) settings[row.key] = row.value as JsonValue;

  return {
    packages: (pkgs.data ?? []) as Pkg[],
    faqs: (faqs.data ?? []) as Faq[],
    advantages: (adv.data ?? []) as Advantage[],
    payment_methods: (pm.data ?? []) as PaymentMethod[],
    gallery: (gal.data ?? []) as GalleryItem[],
    settings,
  };
});
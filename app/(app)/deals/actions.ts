"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type DealStage =
  | "novo"
  | "contato_feito"
  | "proposta"
  | "negociacao"
  | "ganho"
  | "perdido";

export async function createDeal(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const contactId = formData.get("contact_id") as string;
  const value = formData.get("value") as string;

  await supabase.from("deals").insert({
    owner_id: user.id,
    contact_id: contactId || null,
    title: formData.get("title") as string,
    value: value ? Number(value) : null,
  });

  revalidatePath("/deals");
}

export async function updateDealStage(dealId: string, stage: DealStage) {
  const supabase = await createClient();
  await supabase
    .from("deals")
    .update({ stage, updated_at: new Date().toISOString() })
    .eq("id", dealId);
  revalidatePath("/deals");
}

export async function deleteDeal(formData: FormData) {
  const supabase = await createClient();
  const id = formData.get("id") as string;
  await supabase.from("deals").delete().eq("id", id);
  revalidatePath("/deals");
}

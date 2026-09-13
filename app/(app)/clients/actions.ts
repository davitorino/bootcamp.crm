"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { LEADS_SEED } from "./data";

export type ClientStatus =
  | "prospectar"
  | "contatado"
  | "respondeu"
  | "reuniao_marcada"
  | "convertido"
  | "perdido";

export async function importLeads() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const { count } = await supabase
    .from("clients")
    .select("id", { count: "exact", head: true });
  if (count && count > 0) return;

  const rows = LEADS_SEED.map((l) => ({
    owner_id: user.id,
    razao_social: l.razaoSocial,
    segmento: l.segmento,
    endereco: l.endereco,
    cnpj: l.cnpj,
    telefone: l.telefone,
    email: l.email,
    instagram: l.instagram,
    servicos_sugeridos: l.servicosSugeridos,
    status_contato: l.statusContato,
    prioridade: l.prioridade,
    fonte: l.fonte,
  }));

  await supabase.from("clients").insert(rows);
  revalidatePath("/clients");
}

export async function updateClientStatus(clientId: string, status: ClientStatus) {
  const supabase = await createClient();
  await supabase.from("clients").update({ status_contato: status }).eq("id", clientId);
  revalidatePath("/clients");
}

export async function updateClientResponsavel(clientId: string, responsavel: string) {
  const supabase = await createClient();
  await supabase
    .from("clients")
    .update({ responsavel: responsavel || null })
    .eq("id", clientId);
  revalidatePath("/clients");
}

export async function updateClientUltimoContato(clientId: string, date: string) {
  const supabase = await createClient();
  await supabase
    .from("clients")
    .update({ ultimo_contato_em: date || null })
    .eq("id", clientId);
  revalidatePath("/clients");
}

export async function convertClientToDeal(clientId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const { data: client } = await supabase
    .from("clients")
    .select("razao_social")
    .eq("id", clientId)
    .single();
  if (!client) return;

  await supabase.from("deals").insert({
    owner_id: user.id,
    client_id: clientId,
    title: client.razao_social,
    stage: "novo",
  });

  await supabase
    .from("clients")
    .update({ status_contato: "convertido" })
    .eq("id", clientId);

  revalidatePath("/clients");
  revalidatePath("/deals");
}

export async function deleteClient(formData: FormData) {
  const supabase = await createClient();
  const id = formData.get("id") as string;
  await supabase.from("clients").delete().eq("id", id);
  revalidatePath("/clients");
}

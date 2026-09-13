import { createClient } from "@/lib/supabase/server";
import { createDeal, type DealStage } from "./actions";
import { DealCard } from "./DealCard";
import { DbNotReadyBanner } from "../DbNotReadyBanner";

const STAGES: { value: DealStage; label: string }[] = [
  { value: "novo", label: "Novo" },
  { value: "contato_feito", label: "Contato feito" },
  { value: "proposta", label: "Proposta" },
  { value: "negociacao", label: "Negociação" },
  { value: "ganho", label: "Ganho" },
  { value: "perdido", label: "Perdido" },
];

export default async function DealsPage() {
  const supabase = await createClient();

  const [{ data: deals, error }, { data: contacts }] = await Promise.all([
    supabase
      .from("deals")
      .select("id, title, value, stage, contacts(name)")
      .order("created_at", { ascending: false }),
    supabase.from("contacts").select("id, name").order("name"),
  ]);

  if (error) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="text-xl font-extrabold text-ink dark:text-white">Negócios</h1>
        <DbNotReadyBanner table="deals" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="mb-4 text-xl font-extrabold text-ink dark:text-white">
          Novo negócio
        </h1>
        <form
          action={createDeal}
          className="grid grid-cols-1 gap-3 rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950 sm:grid-cols-3"
        >
          <input
            name="title"
            placeholder="Título do negócio"
            required
            className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
          />
          <select
            name="contact_id"
            className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
          >
            <option value="">Sem contato vinculado</option>
            {contacts?.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <input
            name="value"
            type="number"
            step="0.01"
            placeholder="Valor (R$)"
            className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
          />
          <button
            type="submit"
            className="rounded-md bg-brand px-3 py-2 text-sm font-bold text-white transition-colors hover:bg-brand/90 sm:col-span-3"
          >
            Adicionar negócio
          </button>
        </form>
      </div>

      <div>
        <h2 className="mb-4 text-xl font-extrabold text-ink dark:text-white">
          Pipeline
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {STAGES.map((stage) => {
            const stageDeals = deals?.filter((d) => d.stage === stage.value) ?? [];
            return (
              <div key={stage.value} className="flex flex-col gap-2">
                <p
                  className={`text-xs font-bold uppercase tracking-wide ${
                    stage.value === "ganho"
                      ? "text-accent"
                      : stage.value === "perdido"
                        ? "text-zinc-400 dark:text-zinc-500"
                        : "text-muted"
                  }`}
                >
                  {stage.label} ({stageDeals.length})
                </p>
                <div className="flex flex-col gap-2">
                  {stageDeals.map((deal) => (
                    // @ts-expect-error -- supabase join typing simplified for MVP
                    <DealCard key={deal.id} deal={deal} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

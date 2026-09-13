"use client";

import { useTransition } from "react";
import { deleteDeal, updateDealStage, type DealStage } from "./actions";

const STAGES: { value: DealStage; label: string }[] = [
  { value: "novo", label: "Novo" },
  { value: "contato_feito", label: "Contato feito" },
  { value: "proposta", label: "Proposta" },
  { value: "negociacao", label: "Negociação" },
  { value: "ganho", label: "Ganho" },
  { value: "perdido", label: "Perdido" },
];

type Deal = {
  id: string;
  title: string;
  value: number | null;
  stage: DealStage;
  contacts: { name: string } | null;
};

export function DealCard({ deal }: { deal: Deal }) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-3 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">{deal.title}</p>
      {deal.contacts?.name && (
        <p className="text-xs text-zinc-500 dark:text-zinc-400">{deal.contacts.name}</p>
      )}
      {deal.value != null && (
        <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">
          {deal.value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
        </p>
      )}
      <div className="mt-2 flex items-center gap-2">
        <select
          value={deal.stage}
          disabled={isPending}
          onChange={(e) =>
            startTransition(() => updateDealStage(deal.id, e.target.value as DealStage))
          }
          className="flex-1 rounded border border-zinc-300 bg-white px-2 py-1 text-xs dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
        >
          {STAGES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
        <form action={deleteDeal}>
          <input type="hidden" name="id" value={deal.id} />
          <button
            type="submit"
            className="text-xs text-red-600 hover:underline dark:text-red-400"
          >
            Excluir
          </button>
        </form>
      </div>
    </div>
  );
}

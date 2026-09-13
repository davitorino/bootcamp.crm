"use client";

import { useMemo, useState, useTransition } from "react";
import {
  convertClientToDeal,
  deleteClient,
  updateClientResponsavel,
  updateClientStatus,
  updateClientUltimoContato,
  type ClientStatus,
} from "./actions";

export type ClientRow = {
  id: string;
  razao_social: string;
  segmento: string | null;
  endereco: string | null;
  cnpj: string | null;
  telefone: string | null;
  email: string | null;
  instagram: string | null;
  servicos_sugeridos: string | null;
  status_contato: string | null;
  prioridade: string | null;
  fonte: string | null;
  responsavel: string | null;
  ultimo_contato_em: string | null;
};

const STATUSES: { value: ClientStatus; label: string }[] = [
  { value: "prospectar", label: "Prospectar" },
  { value: "contatado", label: "Contatado" },
  { value: "respondeu", label: "Respondeu" },
  { value: "reuniao_marcada", label: "Reunião marcada" },
  { value: "convertido", label: "Convertido" },
  { value: "perdido", label: "Perdido" },
];

function PriorityBadge({ priority }: { priority: string | null }) {
  if (!priority) return <span className="text-zinc-400">—</span>;
  const isHigh = priority.toLowerCase() === "alta";
  return (
    <span
      className={`inline-block whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-bold ${
        isHigh ? "bg-brand-tint text-brand" : "bg-accent-tint text-accent"
      }`}
    >
      {priority}
    </span>
  );
}

function ClientRowView({ client }: { client: ClientRow }) {
  const [isPending, startTransition] = useTransition();
  const [responsavel, setResponsavel] = useState(client.responsavel ?? "");
  const [ultimoContato, setUltimoContato] = useState(client.ultimo_contato_em ?? "");

  return (
    <tr className="border-t border-zinc-200 align-top text-zinc-800 dark:border-zinc-800 dark:text-zinc-200">
      <td className="px-4 py-2 font-medium">{client.razao_social}</td>
      <td className="px-4 py-2">{client.segmento ?? "—"}</td>
      <td className="max-w-[200px] px-4 py-2 text-zinc-600 dark:text-zinc-400">
        {client.endereco ?? "—"}
      </td>
      <td className="px-4 py-2">{client.email ?? "—"}</td>
      <td className="px-4 py-2">
        {client.instagram ? (
          <a
            href={`https://instagram.com/${client.instagram.replace("@", "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-accent hover:underline"
          >
            {client.instagram}
          </a>
        ) : (
          "—"
        )}
      </td>
      <td className="max-w-[200px] px-4 py-2 text-zinc-600 dark:text-zinc-400">
        {client.servicos_sugeridos ?? "—"}
      </td>
      <td className="px-4 py-2">
        <select
          value={client.status_contato ?? "prospectar"}
          disabled={isPending}
          onChange={(e) =>
            startTransition(() =>
              updateClientStatus(client.id, e.target.value as ClientStatus)
            )
          }
          className="rounded border border-zinc-300 bg-white px-2 py-1 text-xs dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
        >
          {STATUSES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </td>
      <td className="px-4 py-2">
        <PriorityBadge priority={client.prioridade} />
      </td>
      <td className="px-4 py-2">
        <input
          value={responsavel}
          onChange={(e) => setResponsavel(e.target.value)}
          onBlur={() => startTransition(() => updateClientResponsavel(client.id, responsavel))}
          placeholder="—"
          className="w-28 rounded border border-zinc-300 bg-white px-2 py-1 text-xs dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
        />
      </td>
      <td className="px-4 py-2">
        <input
          type="date"
          value={ultimoContato}
          onChange={(e) => {
            setUltimoContato(e.target.value);
            startTransition(() => updateClientUltimoContato(client.id, e.target.value));
          }}
          className="rounded border border-zinc-300 bg-white px-2 py-1 text-xs dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
        />
      </td>
      <td className="px-4 py-2">
        <div className="flex flex-col items-start gap-1">
          <button
            type="button"
            disabled={isPending}
            onClick={() => startTransition(() => convertClientToDeal(client.id))}
            className="whitespace-nowrap text-xs font-semibold text-brand hover:underline disabled:opacity-50"
          >
            Transformar em Negócio
          </button>
          <form action={deleteClient}>
            <input type="hidden" name="id" value={client.id} />
            <button
              type="submit"
              className="text-xs text-red-600 hover:underline dark:text-red-400"
            >
              Excluir
            </button>
          </form>
        </div>
      </td>
    </tr>
  );
}

export function ClientsTable({ clients }: { clients: ClientRow[] }) {
  const [search, setSearch] = useState("");
  const [segmento, setSegmento] = useState("");
  const [prioridade, setPrioridade] = useState("");

  const segmentos = useMemo(
    () =>
      Array.from(new Set(clients.map((c) => c.segmento).filter(Boolean))).sort((a, b) =>
        (a as string).localeCompare(b as string, "pt-BR")
      ),
    [clients]
  );

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return clients.filter((c) => {
      if (segmento && c.segmento !== segmento) return false;
      if (prioridade && c.prioridade !== prioridade) return false;
      if (
        term &&
        !c.razao_social.toLowerCase().includes(term) &&
        !(c.segmento ?? "").toLowerCase().includes(term)
      )
        return false;
      return true;
    });
  }, [clients, search, segmento, prioridade]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nome ou segmento..."
          className="min-w-[220px] flex-1 rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
        />
        <select
          value={segmento}
          onChange={(e) => setSegmento(e.target.value)}
          className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
        >
          <option value="">Todos os segmentos</option>
          {segmentos.map((s) => (
            <option key={s} value={s as string}>
              {s}
            </option>
          ))}
        </select>
        <select
          value={prioridade}
          onChange={(e) => setPrioridade(e.target.value)}
          className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
        >
          <option value="">Todas as prioridades</option>
          <option value="Alta">Alta</option>
          <option value="Média">Média</option>
        </select>
        <a
          href="/api/clients/export"
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm font-semibold text-ink hover:bg-zinc-100 dark:border-zinc-700 dark:text-white dark:hover:bg-zinc-900"
        >
          Exportar Excel
        </a>
      </div>

      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        Mostrando {filtered.length} de {clients.length} clientes
      </p>

      <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
        <table className="w-full min-w-[1500px] text-left text-sm">
          <thead className="bg-zinc-100 text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400">
            <tr>
              <th className="px-4 py-2 font-medium">Razão Social</th>
              <th className="px-4 py-2 font-medium">Segmento</th>
              <th className="px-4 py-2 font-medium">Endereço</th>
              <th className="px-4 py-2 font-medium">E-mail</th>
              <th className="px-4 py-2 font-medium">Instagram</th>
              <th className="px-4 py-2 font-medium">Serviços sugeridos</th>
              <th className="px-4 py-2 font-medium">Status</th>
              <th className="px-4 py-2 font-medium">Prioridade</th>
              <th className="px-4 py-2 font-medium">Responsável</th>
              <th className="px-4 py-2 font-medium">Último contato</th>
              <th className="px-4 py-2" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <ClientRowView key={c.id} client={c} />
            ))}
            {!filtered.length && (
              <tr>
                <td colSpan={11} className="px-4 py-6 text-center text-zinc-500">
                  Nenhum cliente encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

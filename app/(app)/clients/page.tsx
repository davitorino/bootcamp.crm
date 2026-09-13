import { createClient } from "@/lib/supabase/server";
import { DbNotReadyBanner } from "../DbNotReadyBanner";
import { ClientsTable } from "./ClientsTable";
import { importLeads } from "./actions";

export default async function ClientsPage() {
  const supabase = await createClient();
  const { data: clients, error } = await supabase
    .from("clients")
    .select("*")
    .order("razao_social", { ascending: true });

  if (error) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="text-xl font-extrabold text-ink dark:text-white">Clientes</h1>
        <DbNotReadyBanner table="clients" />
      </div>
    );
  }

  if (!clients?.length) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="text-xl font-extrabold text-ink dark:text-white">Clientes</h1>
        <div className="rounded-lg border border-zinc-200 bg-white p-6 text-center dark:border-zinc-800 dark:bg-zinc-950">
          <p className="mb-4 text-sm text-zinc-600 dark:text-zinc-400">
            Nenhum cliente cadastrado ainda. Importe a lista de prospecção (100
            estabelecimentos) para começar.
          </p>
          <form action={importLeads}>
            <button
              type="submit"
              className="rounded-md bg-brand px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-brand/90"
            >
              Importar leads
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-xl font-extrabold text-ink dark:text-white">
          Clientes ({clients.length})
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Importado de prospecção — dados reais de contato só quando encontrados
          em fontes públicas.
        </p>
      </div>
      <ClientsTable clients={clients} />
    </div>
  );
}

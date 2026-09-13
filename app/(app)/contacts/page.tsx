import { createClient } from "@/lib/supabase/server";
import { createContact, deleteContact } from "./actions";

export default async function ContactsPage() {
  const supabase = await createClient();
  const { data: contacts } = await supabase
    .from("contacts")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="mb-4 text-xl font-extrabold text-ink dark:text-white">
          Novo contato
        </h1>
        <form
          action={createContact}
          className="grid grid-cols-1 gap-3 rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950 sm:grid-cols-2"
        >
          <input
            name="name"
            placeholder="Nome"
            required
            className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
          />
          <input
            name="email"
            type="email"
            placeholder="E-mail"
            className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
          />
          <input
            name="phone"
            placeholder="Telefone"
            className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
          />
          <input
            name="company"
            placeholder="Empresa"
            className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
          />
          <button
            type="submit"
            className="rounded-md bg-brand px-3 py-2 text-sm font-bold text-white transition-colors hover:bg-brand/90 sm:col-span-2"
          >
            Adicionar contato
          </button>
        </form>
      </div>

      <div>
        <h2 className="mb-4 text-xl font-extrabold text-ink dark:text-white">
          Contatos ({contacts?.length ?? 0})
        </h2>
        <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-100 text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400">
              <tr>
                <th className="px-4 py-2 font-medium">Nome</th>
                <th className="px-4 py-2 font-medium">E-mail</th>
                <th className="px-4 py-2 font-medium">Telefone</th>
                <th className="px-4 py-2 font-medium">Empresa</th>
                <th className="px-4 py-2" />
              </tr>
            </thead>
            <tbody>
              {contacts?.map((c) => (
                <tr
                  key={c.id}
                  className="border-t border-zinc-200 text-zinc-800 dark:border-zinc-800 dark:text-zinc-200"
                >
                  <td className="px-4 py-2">{c.name}</td>
                  <td className="px-4 py-2">{c.email ?? "—"}</td>
                  <td className="px-4 py-2">{c.phone ?? "—"}</td>
                  <td className="px-4 py-2">{c.company ?? "—"}</td>
                  <td className="px-4 py-2 text-right">
                    <form action={deleteContact}>
                      <input type="hidden" name="id" value={c.id} />
                      <button
                        type="submit"
                        className="text-red-600 hover:underline dark:text-red-400"
                      >
                        Excluir
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
              {!contacts?.length && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-zinc-500">
                    Nenhum contato ainda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

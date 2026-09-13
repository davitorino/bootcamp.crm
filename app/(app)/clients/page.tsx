import { getClients } from "./data";

export default function ClientsPage() {
  const clients = getClients();

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-xl font-extrabold text-ink dark:text-white">
          Clientes ({clients.length})
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Lista em ordem alfabética. Dados de exemplo — a importação da planilha
          Excel substituirá esses registros.
        </p>
      </div>

      <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead className="bg-zinc-100 text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400">
            <tr>
              <th className="px-4 py-2 font-medium">Razão Social</th>
              <th className="px-4 py-2 font-medium">CNPJ</th>
              <th className="px-4 py-2 font-medium">Telefone</th>
              <th className="px-4 py-2 font-medium">E-mail</th>
              <th className="px-4 py-2 font-medium">Instagram</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((c) => (
              <tr
                key={c.id}
                className="border-t border-zinc-200 text-zinc-800 dark:border-zinc-800 dark:text-zinc-200"
              >
                <td className="px-4 py-2 font-medium">{c.razaoSocial}</td>
                <td className="px-4 py-2">{c.cnpj}</td>
                <td className="px-4 py-2">{c.telefone}</td>
                <td className="px-4 py-2">{c.email}</td>
                <td className="px-4 py-2">
                  <a
                    href={`https://instagram.com/${c.instagram.replace("@", "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-accent hover:underline"
                  >
                    {c.instagram}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

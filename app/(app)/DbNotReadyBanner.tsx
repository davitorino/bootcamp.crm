export function DbNotReadyBanner({ table }: { table: string }) {
  return (
    <div className="rounded-lg border border-brand/30 bg-brand-tint px-4 py-3 text-sm text-ink">
      <p className="font-bold">Banco de dados ainda não configurado</p>
      <p className="mt-1 text-zinc-700">
        A tabela <code className="rounded bg-white px-1 py-0.5">{table}</code> não
        existe no Supabase ainda. Rode{" "}
        <code className="rounded bg-white px-1 py-0.5">supabase/schema.sql</code>{" "}
        no SQL Editor do Supabase para habilitar esta área.
      </p>
    </div>
  );
}

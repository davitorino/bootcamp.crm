import { supabase } from "@/lib/supabase";

export default async function Home() {
  const configured =
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  let connectionStatus = "Supabase não configurado (faltam as variáveis de ambiente)";
  if (configured) {
    const { error } = await supabase.auth.getSession();
    connectionStatus = error
      ? `Erro ao conectar: ${error.message}`
      : "Conectado ao Supabase com sucesso";
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-zinc-50 p-8 text-center font-sans dark:bg-black">
      <h1 className="text-3xl font-semibold text-black dark:text-zinc-50">
        bootcamp.crm
      </h1>
      <p className="text-zinc-600 dark:text-zinc-400">{connectionStatus}</p>
    </div>
  );
}

import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-2xl font-extrabold text-ink dark:text-white">
        Bem-vindo ao bootcamp<span className="text-brand">.crm</span>
      </h1>
      <p className="text-zinc-600 dark:text-zinc-400">
        Login realizado com sucesso{user?.email ? ` como ${user.email}` : ""}.
      </p>
      <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">
        As áreas de{" "}
        <Link href="/contacts" className="font-semibold text-brand underline">
          Contatos
        </Link>{" "}
        e{" "}
        <Link href="/deals" className="font-semibold text-brand underline">
          Negócios
        </Link>{" "}
        já estão implementadas e vão funcionar assim que o banco de dados for
        configurado no Supabase.
      </p>
    </div>
  );
}

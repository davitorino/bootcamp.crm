import Link from "next/link";
import { signOut } from "../login/actions";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <header className="bg-ink">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-6">
            <span className="font-extrabold text-white">
              bootcamp<span className="text-brand">.crm</span>
            </span>
            <nav className="flex gap-4 text-sm font-semibold">
              <Link
                href="/clients"
                className="text-zinc-300 transition-colors hover:text-brand"
              >
                Clientes
              </Link>
              <Link
                href="/contacts"
                className="text-zinc-300 transition-colors hover:text-brand"
              >
                Contatos
              </Link>
              <Link
                href="/deals"
                className="text-zinc-300 transition-colors hover:text-brand"
              >
                Negócios
              </Link>
            </nav>
          </div>
          <form action={signOut}>
            <button
              type="submit"
              className="text-sm text-zinc-400 transition-colors hover:text-white"
            >
              Sair
            </button>
          </form>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-8">{children}</main>
    </div>
  );
}

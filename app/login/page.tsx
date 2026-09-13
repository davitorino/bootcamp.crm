"use client";

import { useActionState, useState } from "react";
import { signIn, signUp, type AuthState } from "./actions";
import { Logo } from "@/app/components/Logo";

const initialState: AuthState = {};

export default function LoginPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [signInState, signInAction, signInPending] = useActionState(signIn, initialState);
  const [signUpState, signUpAction, signUpPending] = useActionState(signUp, initialState);

  const state = mode === "signin" ? signInState : signUpState;
  const action = mode === "signin" ? signInAction : signUpAction;
  const pending = mode === "signin" ? signInPending : signUpPending;

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 p-4 dark:bg-black">
      <div className="w-full max-w-sm rounded-xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <h1 className="mb-1">
          <Logo textClassName="text-2xl text-ink dark:text-white" iconSize={32} />
        </h1>
        <p className="mb-6 text-sm text-muted">
          {mode === "signin" ? "Entre na sua conta" : "Crie sua conta"}
        </p>

        <form action={action} className="flex flex-col gap-3">
          <input
            name="email"
            type="email"
            placeholder="E-mail"
            required
            className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-brand dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
          />
          <input
            name="password"
            type="password"
            placeholder="Senha"
            required
            minLength={6}
            className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-brand dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
          />

          {state?.error && (
            <p className="text-sm text-red-600 dark:text-red-400">{state.error}</p>
          )}
          {state?.success && (
            <p className="text-sm text-accent">{state.success}</p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="mt-2 rounded-md bg-brand px-3 py-2 text-sm font-bold text-white transition-colors hover:bg-brand/90 disabled:opacity-50"
          >
            {pending ? "Aguarde..." : mode === "signin" ? "Entrar" : "Criar conta"}
          </button>
        </form>

        <button
          type="button"
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          className="mt-4 w-full text-center text-sm text-muted hover:text-brand"
        >
          {mode === "signin" ? "Não tem conta? Cadastre-se" : "Já tem conta? Entre"}
        </button>
      </div>
    </div>
  );
}

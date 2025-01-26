import { redirect } from "next/navigation";
import { getAuth } from "@/lib/auth";
import { CallbackHandler } from "./callback-handler";

export default async function AuthCallback() {
  const auth = await getAuth();

  if (!auth?.user) {
    return redirect("/onboarding/summary?error=auth");
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <CallbackHandler />
    </main>
  );
}

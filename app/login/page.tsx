import LoginButton from "@/components/LoginButton";
import { createClient } from "@/lib/server";
import { redirect } from "next/navigation";

export default async function Login() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/");
  }
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <div className="flex  w-full max-w-xl flex-col items-center justify-center py-32 px-16 bg-white dark:bg-black rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Login with your account to access full features
        </h1>
        <LoginButton />
      </div>
    </div>
  );
}

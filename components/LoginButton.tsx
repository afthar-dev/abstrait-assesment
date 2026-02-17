"use client";
import { createClient } from "@/lib/client";
import google from "@/assets/google.jpg";
import Image from "next/image";

const supabase = createClient();
const login = async () => {
  await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${location.origin}/auth/callback`,
    },
  });
};

export default function LoginButton() {
  return (
    <button
      onClick={login}
      className="px-4 py-2 bg-gray-100 text-black hover:bg-blue-100 transition-colors duration-300 flex items-center rounded"
    >
      <Image src={google} alt="Google" className="w-6 h-5 mr-2 inline-block" />
      <span className="inline-block text-sm font-semibold">
        Sign in with Google
      </span>
    </button>
  );
}

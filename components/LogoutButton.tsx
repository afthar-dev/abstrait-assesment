"use client";

import { createClient } from "@/lib/client";
import { LogOut } from "lucide-react";

export default function Logout() {
  const supabase = createClient();

  const logout = async () => {
    await supabase.auth.signOut();
    location.reload();
  };

  return (
    <button
      className="px-3 py-2 bg-gray-100 text-slate-900 rounded-xl text-sm font-semibold"
      onClick={logout}
    >
      Logout <LogOut className="inline-block ml-1" size={16} />
    </button>
  );
}

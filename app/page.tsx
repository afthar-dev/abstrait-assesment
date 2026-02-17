import DashboardClient from "@/components/DashboardClient";
import { createClient } from "@/lib/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data } = await supabase
    .from("bookmarks")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="w-full">
      <DashboardClient
        userId={user.id}
        email={user.email ?? ""}
        bookmarks={data ?? []}
      />
    </div>
  );
}

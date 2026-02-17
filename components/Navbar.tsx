import Logout from "./LogoutButton";
import { createClient } from "@/lib/server";

export default async function Navbar() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  return (
    <nav className="bg-gray-800 p-4 w-full flex items-end justify-end">
      {user && <Logout />}
    </nav>
  );
}

"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import FormBookmark from "./FormBookmark";
import BookmarkList from "./BookmarkList";
import { createClient } from "@/lib/client";

type Bookmark = {
  id: string;
  title: string;
  url: string;
  created_at: string;
  user_id?: string;
};

type Props = {
  userId: string;
  email: string;
  bookmarks: Bookmark[];
};

export default function DashboardClient({ userId, email, bookmarks }: Props) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<Bookmark[]>(bookmarks);
  const [editing, setEditing] = useState<Bookmark | null>(null);

  const supabase = createClient();

  useEffect(() => {
    const channel = supabase
      .channel(`bookmarks-${userId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bookmarks",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          console.log("REALTIME:", payload);

          setItems((prev) => {
            const { eventType, new: newRow, old: oldRow } = payload;
            let updated = [...prev];

            if (eventType === "INSERT") {
              updated.unshift(newRow as Bookmark);
            }

            if (eventType === "UPDATE") {
              updated = updated.map((b) =>
                b.id === (newRow as Bookmark).id ? (newRow as Bookmark) : b,
              );
            }

            if (eventType === "DELETE") {
              updated = updated.filter((b) => b.id !== (oldRow as Bookmark).id);
            }

            return updated;
          });
        },
      )
      .subscribe((status) => console.log("STATUS:", status));

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  const handleAdd = async (data: { url: string; title: string }) => {
    if (editing) {
      await supabase.from("bookmarks").update(data).eq("id", editing.id);
    } else {
      await supabase.from("bookmarks").insert({
        ...data,
        user_id: userId,
      });
    }

    setOpen(false);
    setEditing(null);
  };

  const handleDelete = async (id: string) => {
    await supabase.from("bookmarks").delete().eq("id", id);
  };

  return (
    <div className="flex flex-col items-center justify-center relative w-full">
      <h1 className="text-4xl font-bold my-5">Bookmarks Dashboard</h1>

      <div className="flex flex-col justify-center items-center w-4xl rounded-lg bg-blue-50 p-10">
        <div className="flex items-center justify-between w-full">
          <p className="text-2xl font-bold">Hello {email.split("@")[0]}!</p>

          <button
            onClick={() => {
              setEditing(null);
              setOpen(true);
            }}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg flex items-center"
          >
            Add Bookmark <Plus className="ml-1" size={16} />
          </button>
        </div>

        <BookmarkList
          bookmarks={items}
          onDelete={handleDelete}
          onEdit={(bookmark) => {
            setEditing(bookmark);
            setOpen(true);
          }}
        />
      </div>

      {open && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-md z-50"
          onClick={() => setOpen(false)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <FormBookmark
              initialData={editing ?? undefined}
              onClose={() => {
                setOpen(false);
                setEditing(null);
              }}
              onAdd={handleAdd}
            />
          </div>
        </div>
      )}
    </div>
  );
}

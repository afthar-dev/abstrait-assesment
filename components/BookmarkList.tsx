"use client";

import { Pencil, Trash } from "lucide-react";

type Bookmark = {
  id: string;
  title: string;
  url: string;
  created_at: string;
};

type Props = {
  bookmarks: Bookmark[];
  onDelete: (id: string) => void;
  onEdit: (bookmark: Bookmark) => void;
};

export default function BookmarkList({ bookmarks, onDelete, onEdit }: Props) {
  return (
    <div className="w-full mt-6 space-y-3">
      {bookmarks.map((b) => (
        <div
          key={b.id}
          className="flex justify-between items-center bg-white/60 backdrop-blur-md p-4 rounded-xl border border-gray-200"
        >
          <div className="flex flex-col">
            <a
              href={b.url}
              target="_blank"
              className="font-semibold text-blue-600"
            >
              {b.title}
            </a>
            <span className="text-sm text-gray-500">{b.url}</span>
          </div>

          <div className="flex gap-3">
            <button onClick={() => onEdit(b)}>
              <Pencil size={16} />
            </button>

            <button onClick={() => onDelete(b.id)} className="text-red-600">
              <Trash size={16} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

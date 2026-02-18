"use client";

import { Plus, X } from "lucide-react";
import { useState } from "react";

type BookMark = {
  url: string;
  title: string;
};

type Props = {
  onAdd: (bookmark: BookMark) => void;
  onClose: () => void;
  initialData?: BookMark;
};

export default function FormBookmark({ onAdd, onClose, initialData }: Props) {
  const [url, setUrl] = useState(initialData?.url ?? "");
  const [title, setTitle] = useState(initialData?.title ?? "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!url.trim() || !title.trim()) return;

    onAdd({ url, title });
  };

  return (
    <div className="bg-white/70 backdrop-blur-xl border border-white/30 shadow-2xl rounded-2xl p-8 w-sm md:w-lg relative">
      <button onClick={onClose} className="absolute right-4 top-4">
        <X size={18} />
      </button>

      <h1 className="text-2xl font-bold mb-4">
        {initialData ? "Edit Bookmark" : "Add Bookmark"}
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="URL"
          className="p-2 rounded-lg border"
        />

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="p-2 rounded-lg border"
        />

        <button className="bg-blue-600 text-white rounded-lg py-2 flex justify-center items-center">
          {initialData ? "Update Bookmark" : "Add Bookmark"}
          {!initialData && <Plus size={16} className="ml-1" />}
        </button>
      </form>
    </div>
  );
}

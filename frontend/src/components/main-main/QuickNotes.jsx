import React, { useEffect, useState } from "react";
import { LucideNotebookPen, LucideX, LucideTrash2, LucidePlus, LucideDownload } from "lucide-react";
import toast from "react-hot-toast";

const API_URL = "http://localhost:8080/api/notes";

function getUserId() {
  const user = JSON.parse(localStorage.getItem("user"));
  return user?.id;
}

function downloadTextFile(filename, content) {
  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export default function QuickNotes() {
  const [open, setOpen] = useState(false);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [newContent, setNewContent] = useState("");

  // Fetch notes on open
  useEffect(() => {
    if (open) fetchNotes();
    // eslint-disable-next-line
  }, [open]);

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL, {
        headers: { "X-User-Id": getUserId() },
      });
      const data = await res.json();
      setNotes(data);
    } catch {
      toast.error("Failed to load notes");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!newContent.trim()) return;
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-User-Id": getUserId(),
        },
        body: JSON.stringify({ content: newContent }),
      });
      if (!res.ok) throw new Error();
      setNewContent("");
      fetchNotes();
      toast.success("Note added");
    } catch {
      toast.error("Failed to add note");
    }
  };

  const handleEdit = (note) => {
    setEditingId(note.id);
    setEditContent(note.content);
  };

  const handleUpdate = async (id) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-User-Id": getUserId(),
        },
        body: JSON.stringify({ content: editContent }),
      });
      if (!res.ok) throw new Error();
      setEditingId(null);
      setEditContent("");
      fetchNotes();
      toast.success("Note updated");
    } catch {
      toast.error("Failed to update note");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this note?")) return;
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: { "X-User-Id": getUserId() },
      });
      if (!res.ok) throw new Error();
      fetchNotes();
      toast.success("Note deleted");
    } catch {
      toast.error("Failed to delete note");
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        className="fixed bottom-6 right-8 z-50 bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-400 hover:from-indigo-600 hover:to-cyan-500 text-white p-4 rounded-full shadow-lg flex items-center gap-2 transition-all border-2 border-white"
        onClick={() => setOpen(true)}
        title="Quick Notes"
      >
        <LucideNotebookPen size={28} />
        <span className="hidden md:inline font-semibold">Notes</span>
      </button>

      {/* Bottom Sheet Sidebar (no dark overlay) */}
      {open && (
        <div className="fixed bottom-0 right-0 z-50 w-full flex justify-end pointer-events-none">
          <div
            className="relative bg-white rounded-t-2xl shadow-2xl p-6 w-full max-w-md h-96 md:mr-8 border pointer-events-auto animate-slideup"
            style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.18)' }}
          >
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              onClick={() => setOpen(false)}
            >
              <LucideX size={24} />
            </button>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <LucideNotebookPen size={24} /> Quick Notes
            </h2>
            <div className="space-y-4 overflow-y-auto max-h-48 pr-1">
              {loading ? (
                <div className="text-center text-gray-400 py-8">Loading...</div>
              ) : notes.length === 0 ? (
                <div className="text-center text-gray-400 py-8">No notes yet.</div>
              ) : (
                notes.map((note) => (
                  <div key={note.id} className="bg-gray-50 rounded-lg p-3 flex items-start gap-2 border">
                    {editingId === note.id ? (
                      <>
                        <textarea
                          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-400"
                          value={editContent}
                          onChange={e => setEditContent(e.target.value)}
                          rows={2}
                        />
                        <button
                          className="ml-2 px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                          onClick={() => handleUpdate(note.id)}
                        >
                          Save
                        </button>
                        <button
                          className="ml-1 px-2 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                          onClick={() => setEditingId(null)}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="flex-1 whitespace-pre-wrap text-gray-800">{note.content}</div>
                        <button
                          className="ml-2 text-blue-500 hover:text-blue-700"
                          onClick={() => handleEdit(note)}
                          title="Edit"
                        >
                          Edit
                        </button>
                        <button
                          className="ml-1 text-red-500 hover:text-red-700"
                          onClick={() => handleDelete(note.id)}
                          title="Delete"
                        >
                          <LucideTrash2 size={18} />
                        </button>
                        <button
                          className="ml-1 text-green-600 hover:text-green-800"
                          onClick={() => downloadTextFile(`note-${note.id}.txt`, note.content)}
                          title="Download as .txt"
                        >
                          <LucideDownload size={18} />
                        </button>
                      </>
                    )}
                  </div>
                ))
              )}
            </div>
            {/* Add new note */}
            <div className="mt-6 flex gap-2">
              <textarea
                className="flex-1 p-2 border rounded focus:ring-2 focus:ring-blue-400"
                placeholder="Write a new note..."
                value={newContent}
                onChange={e => setNewContent(e.target.value)}
                rows={2}
              />
              <button
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded flex items-center gap-1"
                onClick={handleAdd}
                title="Add Note"
              >
                <LucidePlus size={20} />
              </button>
            </div>
          </div>
          {/* Animation for bottom sheet */}
          <style>{`
            .animate-slideup {
              animation: slideup 0.3s cubic-bezier(0.4,0,0.2,1);
            }
            @keyframes slideup {
              from { transform: translateY(100%); }
              to { transform: translateY(0); }
            }
          `}</style>
        </div>
      )}
    </>
  );
} 
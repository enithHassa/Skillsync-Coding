import { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';        //This is used to update existing posts.

const ProgressUpdateList = ({ updates, onDelete, onEdit, onUpdate }) => {
  const [editId, setEditId] = useState(null);
  const [formState, setFormState] = useState({});

  const handleEditClick = (update) => {
    setEditId(update.id);
    setFormState({
      title: update.title,
      description: update.description,
      type: update.type,
      progressDate: update.progressDate,
      completedDate: update.completedDate || '',
      link: update.link || ''
    });
  };

  const handleUpdate = async (id) => {
    try {
      await onUpdate(id, formState);
      //toast.success("Update saved ✅");
      setEditId(null);
    } catch (err) {
      toast.error("Failed to update ❌");
    }
  };

  const handleDelete = async (id) => {
    try {
      await onDelete(id);
      //toast.success("Post deleted 🗑️");
    } catch (err) {
      toast.error("Failed to delete ❌");
    }
  };

  return (
    <div className="space-y-4 mt-6">
      
      {updates.map(update => (
        <div key={update.id} className="border p-4 rounded-xl shadow bg-white space-y-2">
          {editId === update.id ? (
            <form className="space-y-2">
              <input
                className="w-full border p-2 rounded"
                value={formState.title}
                onChange={(e) => setFormState({ ...formState, title: e.target.value })}
                placeholder="Title"
              />
              <textarea
                className="w-full border p-2 rounded"
                value={formState.description}
                onChange={(e) => setFormState({ ...formState, description: e.target.value })}
                placeholder="What did you learn?"
              />
              <select
                className="w-full border p-2 rounded"
                value={formState.type}
                onChange={(e) => setFormState({ ...formState, type: e.target.value })}
              >
                <option value="COMPLETED_TUTORIAL">Completed Tutorial</option>
                <option value="LEARNED_CONCEPT">Learned Concept</option>
                <option value="FINISHED_PROJECT">Finished Project</option>
                <option value="READ_ARTICLE">Read Article</option>
                <option value="JOINED_CHALLENGE">Joined Challenge</option>
                <option value="ACHIEVED_GOAL">Achieved Goal</option>
              </select>
              <input
                className="w-full border p-2 rounded"
                type="date"
                value={formState.completedDate}
                onChange={(e) => setFormState({ ...formState, completedDate: e.target.value })}
                placeholder="Completed Date"
              />
              <input
                className="w-full border p-2 rounded"
                type="url"
                value={formState.link}
                onChange={(e) => setFormState({ ...formState, link: e.target.value })}
                placeholder="Course Link (optional)"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleUpdate(update.id)}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setEditId(null)}
                  className="bg-gray-400 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <>
              <h2 className="text-xl font-semibold">{update.title}</h2>
              <p className="text-sm text-gray-500">
                {update.type} on {new Date(update.progressDate).toLocaleDateString()}
              </p>
              {update.completedDate && (
                <p className="text-sm text-gray-500">Completed on {update.completedDate}</p>
              )}
              {update.link && (
                <a
                  href={update.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 text-sm underline"
                >
                  View Course
                </a>
              )}
              <p className="mt-2">{update.description}</p>
              <div className="mt-4 space-x-2">
                <button
                  onClick={() => handleEditClick(update)}
                  className="bg-yellow-400 text-white px-4 py-2 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(update.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default ProgressUpdateList;

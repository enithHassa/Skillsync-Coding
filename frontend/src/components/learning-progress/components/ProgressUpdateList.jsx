import { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProgressUpdateList = ({ updates, onDelete, onEdit, onUpdate }) => {
  const [editId, setEditId] = useState(null);
  const [formState, setFormState] = useState({});
  
  // State for filter and sort
  const [filterType, setFilterType] = useState('ALL');
  const [sortOption, setSortOption] = useState('newest');

  // Handle editing
  const handleEditClick = (update) => {
    setEditId(update.id);
    setFormState({
      title: update.title,
      description: update.description,
      type: update.type,
      completedDate: update.completedDate?.slice(0, 10) || '',
      link: update.link || ''
    });
  };

  const handleUpdate = async (id) => {
    const { title, description, type, completedDate, link } = formState;

    // Validation
    if (!title || title.trim().length < 3) {
      toast.error("Title must be at least 3 characters long ❗");
      return;
    }

    if (!description || description.trim().length < 10) {
      toast.error("Description must be at least 10 characters long ❗");
      return;
    }

    if (!type) {
      toast.error("Please select a type ❗");
      return;
    }

    if (!completedDate) {
      toast.error("Completed date is required ❗");
      return;
    }
    if (completedDate) {
      const selectedDate = new Date(completedDate);
      const now = new Date();
      if (selectedDate > now) {
        toast.error("Completed date cannot be in the future ❗");
        return;
      }
    }

    if (link && !/^https?:\/\/\S+\.\S+/.test(link)) {
      toast.error("Please enter a valid link (must start with http/https) ❗");
      return;
    }

    try {
      const formattedData = {
        ...formState,
        progressDate: new Date().toISOString(),
        completedDate: formState.completedDate ? `${formState.completedDate}T00:00:00` : null
      };
      await onUpdate(id, formattedData);
      setEditId(null);
    } catch (err) {
      toast.error("Failed to update ❌");
    }
  };

  const handleDelete = async (id) => {
    try {
      await onDelete(id);
    } catch (err) {
      toast.error("Failed to delete ❌");
    }
  };

  // Filter and Sort logic
  const filteredAndSortedUpdates = updates
    .filter(update => {
      return filterType === 'ALL' || update.type === filterType;
    })
    .sort((a, b) => {
      if (sortOption === 'newest') {
        return new Date(b.progressDate) - new Date(a.progressDate);
      } else if (sortOption === 'oldest') {
        return new Date(a.progressDate) - new Date(b.progressDate);
      } else if (sortOption === 'completed_asc') {
        return new Date(a.completedDate) - new Date(b.completedDate);
      } else if (sortOption === 'completed_desc') {
        return new Date(b.completedDate) - new Date(a.completedDate);
      }
      return 0;
    });

  return (
    <div className="space-y-4 mt-6">
      {/* Filter and Sort options */}
      <div className="flex justify-between mb-4 px-4">
        <div className="space-x-4">
          {/* Filter Dropdown */}
          <select
            onChange={(e) => setFilterType(e.target.value)}
            value={filterType}
            className="border p-2 rounded"
          >
            <option value="ALL">All Types</option>
            <option value="COMPLETED_TUTORIAL">Completed Tutorial</option>
            <option value="LEARNED_CONCEPT">Learned Concept</option>
            <option value="FINISHED_PROJECT">Finished Project</option>
            <option value="READ_ARTICLE">Read Article</option>
            <option value="JOINED_CHALLENGE">Joined Challenge</option>
            <option value="ACHIEVED_GOAL">Achieved Goal</option>
          </select>

          {/* Sort Dropdown */}
          <select
            onChange={(e) => setSortOption(e.target.value)}
            value={sortOption}
            className="border p-2 rounded"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="completed_asc">Completed Date ↑</option>
            <option value="completed_desc">Completed Date ↓</option>
          </select>
        </div>
      </div>

      {/* Progress Updates List */}
      {filteredAndSortedUpdates.map(update => (
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
                required
                max={new Date().toLocaleDateString('en-CA')}
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

              <p className="mt-2">{update.description}</p>

              {update.completedDate && (
                <p className="text-sm text-gray-500">
                  {update.type} on {new Date(update.completedDate).toLocaleDateString()}
                </p>
              )}
              
              {update.link && (
                <a
                  href={update.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 text-sm underline"
                >
                  View Course Link
                </a>
              )}
              
              <p className="text-sm text-gray-500">
                Progress added on {new Date(update.progressDate).toLocaleDateString()}
              </p>

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

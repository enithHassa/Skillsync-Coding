import { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; //progress inline form page with filters
import { toggleHighlight } from '../api/progressUpdateApi';

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

  const handleToggleHighlight = async (id) => {
    try {
      const updatedUpdate = await toggleHighlight(id);
      // Instead of trying to refresh the list directly, we'll update the local state
      const updatedUpdates = updates.map(update => 
        update.id === id ? { ...update, highlighted: !update.highlighted } : update
      );
      // Call the parent's onUpdate function to refresh the list
      onUpdate(id, updatedUpdate);
    } catch (err) {
      toast.error("Failed to toggle highlight ❌");
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
    <div className="max-w-4xl mx-auto">
      {/* Title Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white rounded-t-xl mb-6">
        <h1 className="text-2xl font-bold">Your Learning Journey</h1>
        <p className="mt-2 opacity-90">Track and manage your learning progress updates</p>
      </div>

      {/* Filter and Sort Controls */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <select
                onChange={(e) => setFilterType(e.target.value)}
                value={filterType}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 bg-gray-50 appearance-none pr-8"
              >
                <option value="ALL">All Types</option>
                <option value="COMPLETED_TUTORIAL">Completed Tutorial</option>
                <option value="LEARNED_CONCEPT">Learned Concept</option>
                <option value="FINISHED_PROJECT">Finished Project</option>
                <option value="READ_ARTICLE">Read Article</option>
                <option value="JOINED_CHALLENGE">Joined Challenge</option>
                <option value="ACHIEVED_GOAL">Achieved Goal</option>
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            <div className="relative flex-1 sm:flex-none">
              <select
                onChange={(e) => setSortOption(e.target.value)}
                value={sortOption}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 bg-gray-50 appearance-none pr-8"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="completed_asc">Completed Date ↑</option>
                <option value="completed_desc">Completed Date ↓</option>
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          <div className="text-sm text-gray-600">
            Showing {filteredAndSortedUpdates.length} updates
          </div>
        </div>
      </div>

      {/* Progress Updates List */}
      <div className="space-y-4">
        {filteredAndSortedUpdates.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No updates found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {filterType === 'ALL' 
                ? "Start by adding your first learning progress update!"
                : "No updates found for the selected filter."}
            </p>
          </div>
        ) : (
          filteredAndSortedUpdates.map(update => (
            <div 
              key={update.id} 
              className={`bg-white rounded-xl shadow-sm overflow-hidden ${
                update.highlighted ? 'ring-2 ring-yellow-400' : ''
              }`}
            >
              {editId === update.id ? (
                <form className="p-6 space-y-6">
                  <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">Title</label>
                      <input
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 bg-gray-50"
                        value={formState.title}
                        onChange={(e) => setFormState({ ...formState, title: e.target.value })}
                        placeholder="What did you accomplish?"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">Description</label>
                      <textarea
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 bg-gray-50 min-h-[120px]"
                        value={formState.description}
                        onChange={(e) => setFormState({ ...formState, description: e.target.value })}
                        placeholder="What did you learn?"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">Type</label>
                        <select
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 bg-gray-50"
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
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">Completed Date</label>
                        <input
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 bg-gray-50"
                          type="date"
                          value={formState.completedDate}
                          onChange={(e) => setFormState({ ...formState, completedDate: e.target.value })}
                          required
                          max={new Date().toLocaleDateString('en-CA')}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">Resource Link (Optional)</label>
                      <input
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 bg-gray-50"
                        type="url"
                        value={formState.link}
                        onChange={(e) => setFormState({ ...formState, link: e.target.value })}
                        placeholder="https://example.com"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setEditId(null)}
                      className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => handleUpdate(update.id)}
                      className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition duration-200"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              ) : (
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800">{update.title}</h2>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="px-2.5 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                          {update.type.replace(/_/g, ' ')}
                        </span>
                        <span className="text-sm text-gray-500">
                          {new Date(update.completedDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleToggleHighlight(update.id)}
                        className={`p-2 rounded-lg transition duration-200 ${
                          update.highlighted 
                            ? 'text-yellow-500 hover:bg-yellow-50' 
                            : 'text-gray-400 hover:text-yellow-500 hover:bg-yellow-50'
                        }`}
                        title={update.highlighted ? "Remove highlight" : "Highlight this progress"}
                      >
                        <svg 
                          className="w-5 h-5" 
                          fill={update.highlighted ? "currentColor" : "none"} 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth="2" 
                            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleEditClick(update)}
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition duration-200"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(update.id)}
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition duration-200"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <p className="mt-4 text-gray-600 leading-relaxed">{update.description}</p>

                  {update.link && (
                    <a
                      href={update.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-800"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      View Resource
                    </a>
                  )}

                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-sm text-gray-500">
                      Progress added on {new Date(update.progressDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProgressUpdateList;

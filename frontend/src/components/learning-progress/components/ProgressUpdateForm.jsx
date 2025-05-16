import { useState } from 'react';
import { toast } from 'react-toastify';   //add new progress form

const ProgressUpdateForm = ({ onSubmit, initialData }) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [type, setType] = useState(initialData?.type || 'COMPLETED_TUTORIAL');
  const [completedDate, setCompletedDate] = useState(initialData?.completedDate || '');
  const [link, setLink] = useState(initialData?.link || '');

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setType('COMPLETED_TUTORIAL');
    setCompletedDate('');
    setLink('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Title validation (min 3 chars)
    if (!title || title.trim().length < 3) {
      toast.error("Title must be at least 3 characters long ❗");
      return;
    }

    // Description validation (min 10 chars)
    if (!description || description.trim().length < 10) {
      toast.error("Description must be at least 10 characters long ❗");
      return;
    }

    // Type validation (required)
    if (!type) {
      toast.error("Please select a type ❗");
      return;
    }

    // Completed Date validation (required & not in the future)
    if (!completedDate) {
      toast.error("Completed date is required ❗");
      return;
    }

    const selectedDate = new Date(completedDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate > today) {
      toast.error("Completed date cannot be in the future ❗");
      return;
    }

    // Link validation (if provided, must be valid)
    if (link && !/^https?:\/\/\S+\.\S+/.test(link)) {
      toast.error("Please enter a valid link (must start with http/https) ❗");
      return;
    }

    const progressDate = new Date().toISOString();
    const formattedCompletedDate = completedDate || null;

    onSubmit({
      title,
      description,
      type,
      progressDate,
      completedDate: formattedCompletedDate,
      link,
    });

    resetForm();
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white">
          <h1 className="text-2xl font-bold">Track Your Learning Journey</h1>
          <p className="mt-2 opacity-90">Share your progress and achievements with the community</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Title</label>
              <input
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 bg-gray-50"
                placeholder="What did you accomplish?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Description</label>
              <textarea
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 bg-gray-50 min-h-[120px]"
                placeholder="What did you learn?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Type</label>
                <select 
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 bg-gray-50"
                  value={type} 
                  onChange={(e) => setType(e.target.value)}
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
                  value={completedDate}
                  onChange={(e) => setCompletedDate(e.target.value)}
                  max={new Date().toLocaleDateString('en-CA')}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Resource Link (Optional)</label>
              <input
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 bg-gray-50"
                type="url"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="https://example.com"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              {initialData ? 'Update Progress' : 'Share Progress'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProgressUpdateForm;

import { useState } from 'react';
import { toast } from 'react-toastify';

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
    today.setHours(0, 0, 0, 0); // Set current date to 00:00:00
    selectedDate.setHours(0, 0, 0, 0); // Set selected date to 00:00:00

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

    // Call the onSubmit callback with the form data
    onSubmit({
      title,
      description,
      type,
      progressDate,
      completedDate: formattedCompletedDate,
      link,
    });

    // Clear form after submit
    resetForm();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-gray-50 rounded shadow">
      <h1 className="text-3xl font-bold text-center mb-4">Progress Tracker</h1>
      <input
        className="w-full border p-2"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        className="w-full border p-2"
        placeholder="What did you learn?"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <select className="w-full border p-2" value={type} onChange={(e) => setType(e.target.value)}>
        <option value="COMPLETED_TUTORIAL">Completed Tutorial</option>
        <option value="LEARNED_CONCEPT">Learned Concept</option>
        <option value="FINISHED_PROJECT">Finished Project</option>
        <option value="READ_ARTICLE">Read Article</option>
        <option value="JOINED_CHALLENGE">Joined Challenge</option>
        <option value="ACHIEVED_GOAL">Achieved Goal</option>
      </select>

      <input
        className="w-full border p-2"
        type="date"
        value={completedDate}
        onChange={(e) => setCompletedDate(e.target.value)}
        max={new Date().toLocaleDateString('en-CA')}
        placeholder="Completed Date"
      />

      <input
        className="w-full border p-2"
        type="url"
        value={link}
        onChange={(e) => setLink(e.target.value)}
        placeholder="Course Link (optional)"
      />

      <div className="flex justify-center">
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          {initialData ? 'Update' : 'Post'}
        </button>
      </div>
    </form>
  );
};

export default ProgressUpdateForm;

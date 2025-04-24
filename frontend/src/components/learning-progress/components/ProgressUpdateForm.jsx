import { useState } from 'react';

const ProgressUpdateForm = ({ onSubmit, initialData }) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [type, setType] = useState(initialData?.type || 'COMPLETED_TUTORIAL');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title, description, type, progressDate: new Date() });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white rounded shadow">
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
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        {initialData ? 'Update' : 'Post'}
      </button>
    </form>
  );
};

export default ProgressUpdateForm;

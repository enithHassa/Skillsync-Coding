import { useEffect, useState } from 'react';
import {
  getProgressUpdates,
  createProgressUpdate,
  updateProgressUpdate,
  deleteProgressUpdate,
} from '../api/progressUpdateApi';
import ProgressUpdateList from '../components/ProgressUpdateList';
import ProgressUpdateForm from '../components/ProgressUpdateForm';
import Navbar from '../../main-main/Navbar';
import { toast } from 'react-toastify';

const ProgressPage = () => {
  const [updates, setUpdates] = useState([]);

  const load = async () => {
    try {
      const data = await getProgressUpdates();
      setUpdates(data);
    } catch {
      toast.error("Failed to load updates ❌");
    }
  };

  const handleCreate = async (data) => {
    try {
      await createProgressUpdate(data);
      toast.success("Post created 🎉");
      load();
    } catch {
      toast.error("Failed to create post ❌");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteProgressUpdate(id);
      toast.success("Post deleted 🗑️");
      load();
    } catch {
      toast.error("Failed to delete ❌");
    }
  };

  const handleUpdate = async (id, data) => {
    try {
      await updateProgressUpdate(id, data);
      toast.success("Update saved ✅");
      load();
    } catch {
      toast.error("Failed to update ❌");
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <>
      <Navbar />
      <div className="max-w-2xl mx-auto mt-8 px-4">
        {/* Creation Form */}
        <ProgressUpdateForm onSubmit={handleCreate} />

        {/* List of Updates */}
        <ProgressUpdateList
          updates={updates}
          onDelete={handleDelete}
          onUpdate={handleUpdate}
        />
      </div>
    </>
  );
};

export default ProgressPage;

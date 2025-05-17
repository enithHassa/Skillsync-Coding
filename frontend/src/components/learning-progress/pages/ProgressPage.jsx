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
import { Plus } from 'lucide-react';
import { useNotifications } from '../../main-main/NotificationContext';

const ProgressPage = () => {
  const [updates, setUpdates] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const { addNotification } = useNotifications();

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
      addNotification({ message: 'New learning progress posted!', type: 'progress', time: new Date().toLocaleString() });
      toast.success("Post created 🎉");
      load();
      setShowForm(false);
    } catch {
      toast.error("Failed to create post ❌");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteProgressUpdate(id);
      addNotification({ message: 'Learning progress deleted!', type: 'progress', time: new Date().toLocaleString() });
      toast.success("Post deleted 🗑️");
      load();
    } catch {
      toast.error("Failed to delete ❌");
    }
  };

  const handleUpdate = async (id, data) => {
    try {
      await updateProgressUpdate(id, data);
      const updatedData = await getProgressUpdates();
      setUpdates(updatedData);
      toast.success("Update saved ✅");
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
      <div className="max-w-2xl mx-auto mt-8 px-4 relative">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Learning Progress</h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-700 hover:bg-blue-800 text-white px-5 py-2 rounded-lg flex items-center gap-2 font-semibold shadow transition"
            aria-label="Add new progress update"
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium">Add Progress</span>
          </button>
        </div>

        {/* Creation Form - Only shown when showForm is true */}
        {showForm && (
          <div className="fixed inset-0 bg-white flex items-center justify-center z-40 pt-16">
            <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[85vh] overflow-y-auto shadow-2xl">
              <div className="flex justify-end mb-4">
                <button
                  onClick={() => setShowForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <ProgressUpdateForm onSubmit={handleCreate} />
            </div>
          </div>
        )}

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

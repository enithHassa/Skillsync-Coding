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
      <div className="max-w-2xl mx-auto mt-8 px-4 relative">
        {/* Floating Action Button */}
        <button
          onClick={() => setShowForm(!showForm)}
          className="fixed bottom-8 right-8 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full shadow-lg transition-all duration-200 hover:scale-105 z-50 flex items-center gap-2"
          aria-label="Add new progress update"
        >
          <Plus className="w-5 h-5" />
          <span className="font-medium">Add Progress</span>
        </button>

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

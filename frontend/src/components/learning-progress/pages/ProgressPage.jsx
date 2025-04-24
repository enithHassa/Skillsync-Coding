import { useEffect, useState } from 'react';
import {
  getProgressUpdates,
  createProgressUpdate,
  updateProgressUpdate,
  deleteProgressUpdate,
} from '../api/progressUpdateApi';
import ProgressUpdateForm from '../components/ProgressUpdateForm';
import ProgressUpdateList from '../components/ProgressUpdateList';
import Navbar from '../../main-main/Navbar';   //importing navbar

const ProgressPage = () => {
  const [updates, setUpdates] = useState([]);
  const [editing, setEditing] = useState(null);

  const load = async () => {
    setUpdates(await getProgressUpdates());
  };

  const handleSubmit = async (data) => {
    if (editing) {
      await updateProgressUpdate(editing.id, data);
    } else {
      await createProgressUpdate(data);
    }
    setEditing(null);
    load();
  };

  const handleDelete = async (id) => {
    await deleteProgressUpdate(id);
    load();
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <>

    <Navbar />
    <div className="max-w-xl mx-auto mt-8">
      <ProgressUpdateForm onSubmit={handleSubmit} initialData={editing} />
      <div className="mt-6">
        <ProgressUpdateList updates={updates} onDelete={handleDelete} onEdit={setEditing} />
      </div>
    </div>
    </>
  );
};

export default ProgressPage;

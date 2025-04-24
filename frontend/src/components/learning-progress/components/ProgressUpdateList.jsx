import ProgressUpdateCard from './ProgressUpdateCard';

const ProgressUpdateList = ({ updates, onDelete, onEdit }) => (
  <div className="space-y-4">
    {updates.map(update => (
      <ProgressUpdateCard key={update.id} update={update} onDelete={onDelete} onEdit={onEdit} />
    ))}
  </div>
);

export default ProgressUpdateList;

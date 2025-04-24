const ProgressUpdateCard = ({ update, onDelete, onEdit }) => (
    <div className="border p-4 rounded shadow bg-white">
      <h2 className="text-xl font-bold">{update.title}</h2>
      <p className="text-sm text-gray-500">{update.type} on {new Date(update.progressDate).toLocaleDateString()}</p>
      <p className="mt-2">{update.description}</p>
      <div className="mt-4 space-x-2">
        <button onClick={() => onEdit(update)} className="text-blue-500">Edit</button>
        <button onClick={() => onDelete(update.id)} className="text-red-500">Delete</button>
      </div>
    </div>
  );
  
  export default ProgressUpdateCard;
  
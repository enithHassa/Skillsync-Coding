import { useState, useEffect } from 'react';
import axios from 'axios';

const DeleteUser = () => {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, []);

  const handleDelete = async () => {
    if (!selectedUserId) return;
    
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`http://localhost:8080/api/users/${selectedUserId}`);
        alert('User deleted successfully!');
        setSelectedUserId('');
        // Refresh user list
        const response = await axios.get('http://localhost:8080/api/users');
        setUsers(response.data);
      } catch (error) {
        alert('Error deleting user: ' + error.message);
      }
    }
  };

  return (
    <div className="delete-container">
      <h2>Delete User</h2>
      <div className="user-selector">
        <select 
          value={selectedUserId} 
          onChange={(e) => setSelectedUserId(e.target.value)}
        >
          <option value="">Select a user to delete</option>
          {users.map(user => (
            <option key={user._id} value={user._id}>
              {user.firstName} {user.lastName} ({user.email})
            </option>
          ))}
        </select>
      </div>
      
      {selectedUserId && (
        <button onClick={handleDelete} className="delete-btn">
          Delete Selected User
        </button>
      )}
    </div>
  );
};

export default DeleteUser;
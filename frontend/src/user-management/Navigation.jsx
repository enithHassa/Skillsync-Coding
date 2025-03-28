import { Link } from 'react-router-dom';

const Navigation = () => {
  return (
    <nav className="navbar">
      <Link to="/create" className="nav-btn">Create User</Link>
      <Link to="/read" className="nav-btn">View Users</Link>
      <Link to="/update" className="nav-btn">Update User</Link>
      <Link to="/delete" className="nav-btn">Delete User</Link>
    </nav>
  );
};

export default Navigation;
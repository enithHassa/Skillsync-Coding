import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function SearchResults() {
  const query = useQuery().get('q') || '';
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) return;
    setLoading(true);
    Promise.all([
      axios.get(`http://localhost:8080/skillsync/users/search?query=${encodeURIComponent(query)}`),
      axios.get(`http://localhost:8080/api/posts/search?query=${encodeURIComponent(query)}`)
    ]).then(([userRes, postRes]) => {
      setUsers(userRes.data);
      setPosts(postRes.data);
    }).finally(() => setLoading(false));
  }, [query]);

  const highlight = (text) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    return text.split(regex).map((part, i) =>
      regex.test(part) ? <span key={i} className="bg-yellow-200 font-semibold">{part}</span> : part
    );
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      <h2 className="text-2xl font-bold mb-6">Search Results for "{query}"</h2>
      {loading ? <p>Loading...</p> : (
        <>
          <div className="mb-10">
            <h3 className="text-xl font-semibold mb-2">Users</h3>
            {users.length === 0 ? <p className="text-gray-400">No users found.</p> : (
              <ul className="divide-y">
                {users.map(user => (
                  <li key={user.id} className="py-3">
                    <span className="font-medium text-lg">{highlight(user.firstName + ' ' + user.lastName)}</span>
                    <span className="ml-2 text-gray-500 text-sm">({user.email})</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Posts</h3>
            {posts.length === 0 ? <p className="text-gray-400">No posts found.</p> : (
              <ul className="divide-y">
                {posts.map(post => (
                  <li key={post.id} className="py-4">
                    <div className="font-medium text-base mb-1">{highlight(post.description)}</div>
                    <div className="text-gray-500 text-sm">By {highlight(post.userName)}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
} 
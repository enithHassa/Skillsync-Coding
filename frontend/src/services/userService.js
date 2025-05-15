import axios from 'axios';

const API_URL = 'http://localhost:8080/skillsync/users';

export const login = async (email, password) => {
  const res = await axios.get(API_URL);
  const user = res.data.find(user => user.email === email && user.password === password);
  if (!user) throw new Error('Invalid credentials');
  return user;
};

export const signup = async (data) => {
  await axios.post(API_URL, data); // backend only returns a string
  // manually fetch created user for session
  const res = await axios.get(API_URL);
  return res.data.find(u => u.email === data.email && u.password === data.password);
};

export const getUser = (id) => axios.get(`${API_URL}/${id}`);
export const updateUser = (id, data) => axios.put(`${API_URL}/update/${id}`, data);
export const deleteUser = (id) => axios.delete(`${API_URL}/delete/${id}`);
export const followUser = (userId, targetUserId) => axios.post(`${API_URL}/${userId}/follow/${targetUserId}`);
export const unfollowUser = (userId, targetUserId) => axios.post(`${API_URL}/${userId}/unfollow/${targetUserId}`);
export const getFollowers = (userId) => axios.get(`${API_URL}/${userId}/followers`);
export const getFollowing = (userId) => axios.get(`${API_URL}/${userId}/following`);

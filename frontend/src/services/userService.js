// src/services/userService.js
import axios from 'axios';

const API_URL = 'http://localhost:8080/skillsync/users';

export const login = async (email, password) => {
  const res = await axios.get(API_URL);
  console.log("Fetched users:", res.data); // 🔍 Debug
  const user = res.data.find(user => user.email === email && user.password === password);
  if (!user) {
    console.error("Login failed. Email/password incorrect."); // 🔍 Debug
    throw new Error('Invalid credentials');
  }
  return user;
};

export const getUser = (id) => axios.get(`${API_URL}/${id}`);
export const updateUser = (id, data) => axios.put(`${API_URL}/update/${id}`, data);
export const deleteUser = (id) => axios.delete(`${API_URL}/delete/${id}`);

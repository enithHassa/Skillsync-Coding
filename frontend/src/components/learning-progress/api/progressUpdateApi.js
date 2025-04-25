const BASE_URL = 'http://localhost:8080/api/progress';

const getCurrentUserId = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user) {
    throw new Error('User not logged in');
  }
  return user.id;
};

export const getProgressUpdates = async () => {
  const userId = getCurrentUserId();
  const res = await fetch(BASE_URL, {
    headers: {
      'X-User-Id': userId
    }
  });
  if (!res.ok) {
    throw new Error('Failed to fetch progress updates');
  }
  return res.json();
};

export const createProgressUpdate = async (data) => {
  const userId = getCurrentUserId();
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'X-User-Id': userId
    },
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    throw new Error('Failed to create progress update');
  }
  return res.json();
};

export const updateProgressUpdate = async (id, data) => {
  const userId = getCurrentUserId();
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 
      'Content-Type': 'application/json',
      'X-User-Id': userId
    },
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    throw new Error('Failed to update progress update');
  }
  return res.json();
};

export const deleteProgressUpdate = async (id) => {
  const userId = getCurrentUserId();
  const res = await fetch(`${BASE_URL}/${id}`, { 
    method: 'DELETE',
    headers: {
      'X-User-Id': userId
    }
  });
  if (!res.ok) {
    throw new Error('Failed to delete progress update');
  }
};

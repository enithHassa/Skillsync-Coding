const BASE_URL = 'http://localhost:8080/api/progress';

export const getProgressUpdates = async () => {
  const res = await fetch(BASE_URL);
  return res.json();
};

export const createProgressUpdate = async (data) => {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
};

export const updateProgressUpdate = async (id, data) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
};

export const deleteProgressUpdate = async (id) => {
  await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' });
};

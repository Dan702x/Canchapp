const BASE_URL = import.meta.env.VITE_API || 'http://localhost:8080/api';

export async function get(path){
  const r = await fetch(`${BASE_URL}${path}`, { credentials:'include' });
  if(!r.ok) throw new Error('Error');
  return r.json();
}

export async function post(path, body){
  const r = await fetch(`${BASE_URL}${path}`, {
    method:'POST',
    headers:{ 'Content-Type':'application/json' },
    credentials:'include',
    body: JSON.stringify(body)
  });
  if(!r.ok) throw new Error('Error');
  return r.json();
}

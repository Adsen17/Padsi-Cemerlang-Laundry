// lib/auth.js

// =======================
// SIGNUP (kalau ada API signup)
// =======================
export async function signup({ username, password }) {
  const res = await fetch('/api/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || 'Signup gagal');
  }

  // Simpan user ke localStorage
  if (typeof window !== 'undefined') {
    localStorage.setItem('auth_user', JSON.stringify({ id: data.id, username }));
  }

  return data;
}

// =======================
// LOGIN (yang benar untuk API baru)
// =======================
export async function login({ username, password }) {
  const res = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || 'Login gagal');
  }

  // API mengembalikan: { message: "success", id: x }
  if (typeof window !== 'undefined') {
    localStorage.setItem('auth_user', JSON.stringify({ id: data.id, username }));
  }

  return data;
}

// =======================
// LOGOUT
// =======================
export function logout() {
  if (typeof window !== 'undefined')
    localStorage.removeItem('auth_user');
}

// =======================
// GET AUTH USER
// =======================
export function getAuth() {
  if (typeof window === 'undefined') return null;
  try {
    const u = localStorage.getItem('auth_user');
    if (!u) return null;
    return JSON.parse(u);
  } catch {
    return null;
  }
}

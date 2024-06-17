const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000',
});

export const getToken = async (username, password) => {
  const response = await api.post('/api/token/', { username, password });
  const { access, refresh } = response.data;
  
  const base64Url = access.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
  
  const { user_id } = JSON.parse(jsonPayload);

  localStorage.setItem('access_token', access);
  localStorage.setItem('refresh_token', refresh);
  localStorage.setItem('userId', user_id); // Armazenar userId no localStorage
  
  return access;
};

export const createOrder = async (description, userId) => {
  const token = localStorage.getItem('access_token');
  const response = await api.post('/orders/create/', { description, user_id: userId }, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
  
export const getOrders = async () => {
  const token = localStorage.getItem('access_token');
  const response = await api.get('/orders/list/', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
  
export const createUser = async (username, password) => {
    const response = await fetch(`${BACKEND_URL}/orders/create_user/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
    return response.json();
};

export const getUsers = async () => {
  const token = localStorage.getItem('access_token');
  const response = await api.get('/orders/users/', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
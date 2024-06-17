'use client';

import { useState } from 'react';
import { getToken } from '../../utils/api'
import { connectWebSocket } from '../../utils/websockets';
import { useRouter } from 'next/navigation';
import Header from '@/components/header';
import '../globals.css';


export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const token = await getToken(username, password);
      connectWebSocket(token);
      localStorage.setItem('token', token);
      router.push('/');
    } catch (error) {
      setError('Failed to authenticate');
      console.log(error);
    }
  };

  return (
    <div>
      <Header></Header>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Nome de usuário"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Senha"
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

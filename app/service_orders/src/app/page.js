'use client';

import { useState, useEffect } from 'react';
import { createOrder, getOrders, getUsers } from '../utils/api';
import { connectWebSocket, sendOrder, onOrderReceived } from '../utils/websockets';
import { useRouter } from 'next/navigation';
import Popup from './components/popup';
import './globals.css';

export default function Home() {
  const [orders, setOrders] = useState([]);
  const [description, setDescription] = useState('');
  const router = useRouter(); 
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [error, setError] = useState(null);
  const [newOrder, setNewOrder] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const userId = localStorage.getItem('userId');
    if (!token || !userId) {
      router.push('/login');
    } else {
      connectWebSocket(token);

      const loadOrders = async () => {
        try {
          const ordersList = await getOrders();
          console.log('Fetched orders:', ordersList);
          setOrders(ordersList);
        } catch (error) {
          setError('Failed to fetch orders');
        }
      };

      loadOrders();

      const fetchUsers = async () => {
        try {
          const usersData = await getUsers();
          console.log('Fetched users:', usersData);
          setUsers(usersData);
        } catch (error) {
          console.log(error);
          setError('Failed to fetch users');
        }
      };

      fetchUsers();

      onOrderReceived((newOrder) => {
        console.log('New order received:', newOrder);
        setOrders((prevOrders) => {
          const orderExists = prevOrders.some(order => order.id === newOrder.id);
          if (!orderExists) {
            console.log('Adding new order to state:', newOrder);
            return [...prevOrders, newOrder];
          } else {
            console.log('Order already exists in state:', newOrder);
            return prevOrders;
          }
        });
        setNewOrder(newOrder);
      });
    }
  }, [router]);

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    try {
      const newOrder = await createOrder(description, selectedUser);
      console.log('Order created:', newOrder);
      sendOrder({ description, user_id: selectedUser });
      setDescription('');
      setSelectedUser('');
      setError(null);
    } catch (error) {
      console.log(error);
      setError('Failed to create order');
    }
  };

  const handleClosePopup = () => {
    setNewOrder(null);
  };

  return (
    <div>
      <h1>Ordens de Serviço</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleOrderSubmit}>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Order description"
        />
        <select
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
        >
          <option value="">Select user</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.username}
            </option>
          ))}
        </select>
        <button type="submit">Create Order</button>
      </form>
      <ul>
        {orders.map((order) => (
          <li key={order.id}>{order.description}</li>
        ))}
      </ul>
      {newOrder && <Popup order={newOrder} onClose={handleClosePopup} />}
    </div>
  );
}

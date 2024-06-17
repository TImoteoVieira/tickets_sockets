// src/utils/websockets.js

let socket;

export const connectWebSocket = (token) => {
  console.log('Connecting to WebSocket with token:', token);
  socket = new WebSocket(`ws://127.0.0.1:8000/ws/orders/?token=${token}`);

  socket.onopen = () => {
    console.log('WebSocket connection established');
  };

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log('WebSocket message received:', data);
    handleOrderReceived(data);
  };

  socket.onclose = (event) => {
    console.log('WebSocket connection closed:', event);
  };

  socket.onerror = (error) => {
    console.log('WebSocket error:', error);
  };
};

export const sendOrder = (order) => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    console.log('Sending order via WebSocket:', order);
    socket.send(JSON.stringify(order));
  }
};

export const onOrderReceived = (callback) => {
  handleOrderReceived = callback;
};

let handleOrderReceived = (order) => {
  console.log('Order received in callback:', order);
};

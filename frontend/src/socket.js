import { io } from 'socket.io-client';

let socket = null;
const listeners = new Map();

export function initSocket(userId) {
  const serverUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
  
  socket = io(serverUrl, {
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 5
  });

  socket.on('connect', () => {
    console.log('Connected to server');
    socket.emit('user:login', userId);
  });

  socket.on('disconnect', () => {
    console.log('Disconnected from server');
  });

  // Setup event listeners
  Object.keys(listeners).forEach(event => {
    socket.on(event, (data) => {
      listeners.get(event).forEach(callback => callback(data));
    });
  });

  return socket;
}

export function getSocket() {
  return socket;
}

export function on(event, callback) {
  if (!listeners.has(event)) {
    listeners.set(event, []);
    if (socket) {
      socket.on(event, (data) => {
        listeners.get(event).forEach(cb => cb(data));
      });
    }
  }
  listeners.get(event).push(callback);

  // Return unsubscribe function
  return () => {
    const callbacks = listeners.get(event);
    const index = callbacks.indexOf(callback);
    if (index > -1) {
      callbacks.splice(index, 1);
    }
  };
}

export function emit(event, data) {
  if (socket) {
    socket.emit(event, data);
  }
}

export function closeSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

import { useEffect, useRef, useState } from 'react';
import { WebSocketMessage, User } from '../types';

export const useWebSocket = (documentId: string, user: User) => {
  const [isConnected, setIsConnected] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const wsRef = useRef<WebSocket | null>(null);
  const messageHandlersRef = useRef<Map<string, (data: any) => void>>(new Map());

  const connect = () => {
    if (!documentId || !user.name) {
      console.log('WebSocket: Missing documentId or user name, skipping connection');
      return;
    }

    try {
      console.log('WebSocket: Connecting with documentId:', documentId, 'userId:', user.id, 'userName:', user.name);
      const ws = new WebSocket(`ws://localhost:8080?documentId=${documentId}&userId=${user.id}&userName=${encodeURIComponent(user.name)}`);
      
      ws.onopen = () => {
        console.log('WebSocket connected to document:', documentId);
        setIsConnected(true);
        setReconnectAttempts(0);
      };

      ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          console.log('WebSocket message received:', message.type, message.data);
          const handler = messageHandlersRef.current.get(message.type);
          if (handler) {
            handler(message.data);
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      ws.onclose = () => {
        console.log('WebSocket disconnected from document:', documentId);
        setIsConnected(false);
        
        // Auto-reconnect with exponential backoff
        if (reconnectAttempts < 5 && documentId && user.name) {
          const timeout = Math.pow(2, reconnectAttempts) * 1000;
          console.log(`WebSocket: Reconnecting in ${timeout}ms (attempt ${reconnectAttempts + 1})`);
          setTimeout(() => {
            setReconnectAttempts(prev => prev + 1);
            connect();
          }, timeout);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setIsConnected(false);
      };

      wsRef.current = ws;
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
    }
  };

  useEffect(() => {
    if (documentId && user.name) {
      console.log('WebSocket: Effect triggered, connecting...');
      connect();
    }

    return () => {
      if (wsRef.current) {
        console.log('WebSocket: Cleaning up connection');
        wsRef.current.close();
      }
    };
  }, [documentId, user.id, user.name]);

  const sendMessage = (type: string, data: any) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      const message: WebSocketMessage = {
        type: type as any,
        data,
        userId: user.id,
        documentId
      };
      console.log('WebSocket: Sending message:', message);
      wsRef.current.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket: Cannot send message, connection not ready');
    }
  };

  const onMessage = (type: string, handler: (data: any) => void) => {
    messageHandlersRef.current.set(type, handler);
  };

  const offMessage = (type: string) => {
    messageHandlersRef.current.delete(type);
  };

  // Handle users update
  useEffect(() => {
    onMessage('users-update', (data: User[]) => {
      console.log('WebSocket: Users update received:', data);
      setUsers(data.filter(u => u.id !== user.id));
    });

    return () => {
      offMessage('users-update');
    };
  }, [user.id]);

  return {
    isConnected,
    users,
    sendMessage,
    onMessage,
    offMessage,
    reconnectAttempts
  };
};

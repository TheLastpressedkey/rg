import { useEffect, useRef, useState } from 'react';
import { WebSocketMessage, User } from '../types';

export const useWebSocket = (documentId: string, user: User) => {
  const [isConnected, setIsConnected] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const wsRef = useRef<WebSocket | null>(null);
  const messageHandlersRef = useRef<Map<string, (data: any) => void>>(new Map());

  const connect = () => {
    try {
      const ws = new WebSocket(`ws://localhost:8080?documentId=${documentId}&userId=${user.id}&userName=${encodeURIComponent(user.name)}`);
      
      ws.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
        setReconnectAttempts(0);
      };

      ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          const handler = messageHandlersRef.current.get(message.type);
          if (handler) {
            handler(message.data);
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      ws.onclose = () => {
        console.log('WebSocket disconnected');
        setIsConnected(false);
        
        // Auto-reconnect with exponential backoff
        if (reconnectAttempts < 5) {
          const timeout = Math.pow(2, reconnectAttempts) * 1000;
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
    connect();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [documentId, user.id]);

  const sendMessage = (type: string, data: any) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      const message: WebSocketMessage = {
        type: type as any,
        data,
        userId: user.id,
        documentId
      };
      wsRef.current.send(JSON.stringify(message));
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
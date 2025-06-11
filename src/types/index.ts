export interface User {
  id: string;
  name: string;
  color: string;
  lastSeen: number;
}

export interface Document {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
}

export interface WebSocketMessage {
  type: 'text-change' | 'cursor-position' | 'user-join' | 'user-leave' | 'document-update' | 'users-update';
  data: any;
  userId?: string;
  documentId?: string;
}

export interface TextChangeData {
  content: string;
  selection?: {
    start: number;
    end: number;
  };
}

export interface CursorPosition {
  userId: string;
  position: number;
  userName: string;
  color: string;
}
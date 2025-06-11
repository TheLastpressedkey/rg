import { WebSocketServer } from 'ws';
import { createServer } from 'http';
import { parse } from 'url';

const server = createServer();
const wss = new WebSocketServer({ server });

// Store documents and users
const documents = new Map();
const documentUsers = new Map(); // documentId -> Set of users

// Generate user colors
const colors = [
  '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', 
  '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6366F1'
];

wss.on('connection', (ws, req) => {
  const { query } = parse(req.url, true);
  const { documentId, userId, userName } = query;

  if (!documentId || !userId || !userName) {
    ws.close(1008, 'Missing required parameters');
    return;
  }

  console.log(`User ${userName} (${userId}) connected to document ${documentId}`);

  // Initialize document if it doesn't exist
  if (!documents.has(documentId)) {
    documents.set(documentId, {
      id: documentId,
      content: '',
      createdAt: Date.now(),
      updatedAt: Date.now()
    });
    documentUsers.set(documentId, new Map());
  }

  const users = documentUsers.get(documentId);
  const userColor = colors[users.size % colors.length];

  // Add user to document
  const user = {
    id: userId,
    name: decodeURIComponent(userName),
    color: userColor,
    ws: ws,
    lastSeen: Date.now()
  };

  users.set(userId, user);

  // Send current document content to new user
  const document = documents.get(documentId);
  ws.send(JSON.stringify({
    type: 'text-change',
    data: { content: document.content }
  }));

  // Broadcast user list update
  const broadcastUserUpdate = () => {
    const userList = Array.from(users.values()).map(u => ({
      id: u.id,
      name: u.name,
      color: u.color,
      lastSeen: u.lastSeen
    }));

    const message = JSON.stringify({
      type: 'users-update',
      data: userList
    });

    users.forEach(u => {
      if (u.ws.readyState === 1) { // WebSocket.OPEN
        u.ws.send(message);
      }
    });
  };

  broadcastUserUpdate();

  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data.toString());
      
      if (message.type === 'text-change') {
        // Update document
        const doc = documents.get(documentId);
        doc.content = message.data.content;
        doc.updatedAt = Date.now();
        
        // Broadcast to all other users in the document
        users.forEach(u => {
          if (u.id !== userId && u.ws.readyState === 1) {
            u.ws.send(JSON.stringify({
              type: 'text-change',
              data: message.data
            }));
          }
        });
      } else if (message.type === 'cursor-position') {
        // Broadcast cursor position to all other users
        users.forEach(u => {
          if (u.id !== userId && u.ws.readyState === 1) {
            u.ws.send(JSON.stringify({
              type: 'cursor-position',
              data: message.data
            }));
          }
        });
      }

      // Update user's last seen time
      if (users.has(userId)) {
        users.get(userId).lastSeen = Date.now();
      }

    } catch (error) {
      console.error('Error processing message:', error);
    }
  });

  ws.on('close', () => {
    console.log(`User ${userName} (${userId}) disconnected from document ${documentId}`);
    
    // Remove user from document
    users.delete(userId);
    
    // Clean up empty documents after 1 hour
    if (users.size === 0) {
      setTimeout(() => {
        if (documentUsers.get(documentId)?.size === 0) {
          documents.delete(documentId);
          documentUsers.delete(documentId);
          console.log(`Cleaned up empty document: ${documentId}`);
        }
      }, 60 * 60 * 1000); // 1 hour
    }

    // Broadcast user list update
    broadcastUserUpdate();
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

// Cleanup inactive users periodically
setInterval(() => {
  const now = Date.now();
  const inactiveThreshold = 30 * 60 * 1000; // 30 minutes

  documentUsers.forEach((users, documentId) => {
    const usersToRemove = [];
    
    users.forEach((user, userId) => {
      if (now - user.lastSeen > inactiveThreshold || user.ws.readyState !== 1) {
        usersToRemove.push(userId);
      }
    });

    usersToRemove.forEach(userId => {
      users.delete(userId);
      console.log(`Removed inactive user: ${userId} from document: ${documentId}`);
    });

    // Broadcast user list update if users were removed
    if (usersToRemove.length > 0) {
      const userList = Array.from(users.values()).map(u => ({
        id: u.id,
        name: u.name,
        color: u.color,
        lastSeen: u.lastSeen
      }));

      const message = JSON.stringify({
        type: 'users-update',
        data: userList
      });

      users.forEach(u => {
        if (u.ws.readyState === 1) {
          u.ws.send(message);
        }
      });
    }
  });
}, 5 * 60 * 1000); // Check every 5 minutes

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`WebSocket server running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('Shutting down server...');
  wss.close(() => {
    server.close(() => {
      console.log('Server shut down');
      process.exit(0);
    });
  });
});
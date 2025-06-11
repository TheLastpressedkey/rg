export const generateUserColor = (): string => {
  const colors = [
    '#3B82F6', // blue
    '#10B981', // emerald
    '#F59E0B', // amber
    '#EF4444', // red
    '#8B5CF6', // violet
    '#06B6D4', // cyan
    '#84CC16', // lime
    '#F97316', // orange
    '#EC4899', // pink
    '#6366F1', // indigo
  ];
  
  return colors[Math.floor(Math.random() * colors.length)];
};

export const generateUserId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

export const generateDocumentId = (): string => {
  return Math.random().toString(36).substr(2, 12);
};
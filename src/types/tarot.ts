export interface TarotCard {
  id: string;
  name: string;
  image: string;
  description: string;
  suit?: string;
  number?: number;
  isReversed?: boolean;
}

export interface CardPosition {
  x: number;
  y: number;
  rotation: number;
  zIndex: number;
}

export interface DrawnCard extends TarotCard {
  position: CardPosition;
  drawnAt: number;
}
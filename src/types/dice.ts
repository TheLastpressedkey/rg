export interface DiceValue {
  dice1: number;
  dice2: number;
  total: number;
  rolledAt: number;
}

export interface DiceState {
  isRolling: boolean;
  currentValue: DiceValue | null;
  rollHistory: DiceValue[];
}
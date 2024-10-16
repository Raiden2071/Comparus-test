export interface GameScore {
  player: number;
  computer: number;
}

export enum GameColors {
  BLUE = 'blue',
  YELLOW = 'yellow',
  GREEN = 'green',
  RED = 'red',
}

export interface GameCell {
  id: number;
  color: GameColors;
}

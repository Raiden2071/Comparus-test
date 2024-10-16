import { Injectable, signal } from '@angular/core';

import { interval, Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';

import { GameCell, GameColors, GameScore } from '../models/game.models';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  public cells = signal<GameCell[]>(Array.from({ length: 100 }, (_, i) => ({
    id: i,
    color: GameColors.BLUE,
  })));
  public score = signal<GameScore>({ player: 0, computer: 0 });
  public gameResult = signal<string | null>(null);

  private gameOver = signal<boolean>(false);
  private currentCellId = signal<number | null>(null);
  private intervalInMs = signal(1000);

  private previousCellId: number | null = null;
  private destroy$ = new Subject<void>();
  private roundOver$ = new Subject<void>();

  public startGame(intervalMs: number): void {
    this.resetGame();
    this.setIntervalBetweenRounds(intervalMs);
    this.startRound(intervalMs);
  }

  public resetGame(): void {
    this.cells.set(Array.from({ length: 100 }, (_, i) => ({
      id: i,
      color: GameColors.BLUE,
    })));
    this.score.set({ player: 0, computer: 0 });
    this.gameOver.set(false);
    this.previousCellId = null;
    this.destroy$.next();
    this.gameResult.set(null);
  }

  public setIntervalBetweenRounds(intervalMs: number): void {
    this.intervalInMs.set(intervalMs);
  }

  public playerClick(cellId: number): void {
    if (this.gameOver()) return;

    if (this.currentCellId() === cellId) {
      this.setCellColor(cellId, GameColors.GREEN);
      this.updateScore('player');
    }
  }

  private getRandomCellId(): number {
    let randomCellId;
    do {
      randomCellId = Math.floor(Math.random() * 100);
    } while (randomCellId === this.previousCellId);
    return randomCellId;
  }

  private startRound(intervalMs: number): void {
    if (this.gameOver()) return;

    const randomCellId = this.getRandomCellId();
    this.previousCellId = randomCellId;
    this.currentCellId.set(randomCellId);
    this.setCellColor(randomCellId, GameColors.YELLOW);

    this.roundOver$.next();

    interval(intervalMs)
      .pipe(
        takeUntil(this.roundOver$),
        takeUntil(this.destroy$),
        tap(() => this.handleTimeout(randomCellId))
      )
      .subscribe();
  }

  private handleTimeout(cellId: number): void {
    if (this.gameOver()) return;

    this.setCellColor(cellId, GameColors.RED);
    this.updateScore('computer');
  }

  private updateScore(player: 'player' | 'computer'): void {
    const updatedScore = { ...this.score(), [player]: this.score()[player] + 1 };
    this.score.set(updatedScore);
    this.checkGameEnd();

    if (!this.gameOver()) {
      this.startRound(this.intervalInMs());
    }
  }

  private checkGameEnd(): void {
    const { player, computer } = this.score();
    if (player === 10 || computer === 10) {
      this.gameOver.set(true);
      this.destroy$.next();
      this.gameResult.set(player === 10 ? 'Player wins!!!' : 'Computer wins!!!');
    }
  }

  private setCellColor(cellId: number, color: GameColors): void {
    const updatedCells = [...this.cells()];
    updatedCells[cellId] = { ...updatedCells[cellId], color };
    this.cells.set(updatedCells);
  }
}

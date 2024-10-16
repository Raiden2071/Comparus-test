import { ChangeDetectionStrategy, Component, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { GameCell, GameScore } from '../../models/game.models';
import { GameService } from '../../services/game.service';
import { GameResultDialogComponent } from '../../dialogs/game-result-dialog/game-result-dialog.component';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormsModule,
    GameResultDialogComponent,
  ]
})
export class GameComponent {
  cells: WritableSignal<GameCell[]> = this.gameService.cells;
  score: WritableSignal<GameScore> = this.gameService.score;
  result: WritableSignal<string | null> = this.gameService.gameResult;
  intervalMs: WritableSignal<number> = signal<number>(1000);

  constructor(private gameService: GameService) {}

  public startGame(): void {
    this.gameService.startGame(this.intervalMs());
  }

  public onCellClick(cellId: number): void {
    this.gameService.playerClick(cellId);
  }
}

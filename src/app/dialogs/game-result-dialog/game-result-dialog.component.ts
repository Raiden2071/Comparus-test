import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { GameService } from '../../services/game.service';

@Component({
  selector: 'app-game-result-dialog',
  standalone: true,
  imports: [],
  templateUrl: './game-result-dialog.component.html',
  styleUrl: './game-result-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameResultDialogComponent {
  @Input() message: string | null = '';

  constructor(private readonly gameService: GameService) {}

  public cancel(): void {
    this.gameService.resetGame();
  }
}

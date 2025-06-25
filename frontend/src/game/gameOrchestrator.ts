import { BabylonCanvas } from '@/game/babylon/BabylonCanvas';
import { BabylonGUI } from '@/game/babylon/BabylonGUI.js';
// import GameCanvas for its type and to access its methods/control game state
import { GameCanvas } from '@/game/GameCanvas.js';
import { GameLevel } from '@/utils/gameUtils/types.js';
import { RemotePlayers } from '@/pages/remotePlayers';

export class gameOrchestrator {
  private babylonCanvas: BabylonCanvas;
  private gui: BabylonGUI;
  private gameCanvas: GameCanvas;
  private remoteSync: RemotePlayers;

  constructor(containerId: string) {
    this.babylonCanvas = new BabylonCanvas(containerId);
    // reference instance of GameCanvas being created/managed by BabylonCanvas
    this.gameCanvas = this.babylonCanvas.getGameCanvas();
    this.gui = new BabylonGUI(this.babylonCanvas.getScene());

  this.remoteSync = new RemotePlayers('ws://localhost:4000/ws');

  setInterval(() => {
    if (this.gameCanvas && this.gameCanvas.getPlayerPosition) {
      const position = this.gameCanvas.getPlayerPosition();
      this.remoteSync.sendPlayerPosition(position);
    }
  }, 100);

  this.remoteSync.onRemotePositionUpdate((playerId, position) => {
    this.gameCanvas.updateRemotePlayerPosition(playerId, position);
  });

    this.setupMenuFlow();
    this.babylonCanvas.startRenderLoop();
  }

  setupMenuFlow() {
    this.gui.showStartButton(() => {
      this.gui.showDifficultySelector((level) => {
        this.gameCanvas.setLevel(level as GameLevel);
        this.gui.showCountdown(3, () => {
          this.gameCanvas.startGame();
        });
      });
    });
  }

  // TODO CONCEPT: where to call it?
  cleanup() {
    this.babylonCanvas.cleanupGame();
  }
}

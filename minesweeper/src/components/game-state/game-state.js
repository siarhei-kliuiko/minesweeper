export default class GameState {
  static current;

  static save(mineField, secondsCounter, clicksCounter, minesCounter, flagsCounter) {
    const cellsInfo = mineField.cells
      .map((cell) => ({ type: cell.type, isOpened: cell.isOpened, isFlagged: cell.isFlagged }));
    const secondCounterState = {
      seconds: secondsCounter.seconds,
      isEnabled: !!secondsCounter.intervalId,
    };

    localStorage.setItem('gameState', JSON.stringify({
      cellsInfo,
      secondCounterState,
      clicksCount: clicksCounter.count,
      minesCount: minesCounter.count,
      flagsCount: flagsCounter.count,
    }));
  }

  static load() {
    GameState.current = JSON.parse(localStorage.getItem('gameState'));
    localStorage.removeItem('gameState');
  }
}

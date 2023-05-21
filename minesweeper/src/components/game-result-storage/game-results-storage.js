import './game-result-board-style.scss';

export default class GameResultsStorage {
  static getResultsBoard() {
    const board = document.createElement('div');
    board.className = 'game-results-board';
    const title = document.createElement('h2');
    title.className = 'game-results-board__title';
    title.innerText = 'Results';
    const list = document.createElement('ul');
    board.append(title, list);
    const resultsRecords = JSON.parse(localStorage.getItem('results'));
    if (resultsRecords) {
      resultsRecords.forEach((record) => {
        const gameResult = document.createElement('li');
        gameResult.className = `game-results-board__record game-results-board__record_${record.isWin ? 'win' : 'lose'}`;
        gameResult.innerText = `${record.isWin ? 'Win' : 'Lose'} in ${record.seconds} seconds with ${record.clicks} moves ${record.isWin ? '' : `and ${record.minesFound}/${record.mines} mines found `} on ${record.difficulty} difficulty`;
        list.append(gameResult);
      });
    }

    return board;
  }

  static addGameResult(isWin, seconds, clicks, mines, difficulty, minesFound = mines) {
    const gameResult = {
      isWin,
      seconds,
      clicks,
      minesFound,
      mines,
      difficulty,
    };

    let resultsRecords = JSON.parse(localStorage.getItem('results'));
    if (resultsRecords) {
      resultsRecords.push(gameResult);
      if (resultsRecords.length > 10) {
        resultsRecords = resultsRecords.slice(1, resultsRecords.length);
      }
    } else {
      resultsRecords = [gameResult];
    }

    localStorage.setItem('results', JSON.stringify(resultsRecords));
  }
}

export const gameDifficulties = {
  easy: { name: 'easy', value: 10 },
  medium: { name: 'medium', value: 15 },
  hard: { name: 'hard', value: 25 },
};

export class GameSettings {
  static get() {
    let settings = JSON.parse(localStorage.getItem('settings'));
    let settingGetFailed = false;
    if (settings) {
      const difficultyValue = Number(settings.difficulty.value);
      const minesCount = Number(settings.minesCount);
      if (Number.isNaN(difficultyValue) && Number.isNaN(minesCount)) {
        settingGetFailed = true;
      } else {
        if (!Object.values(gameDifficulties)
          .some((knownDifficulty) => knownDifficulty.value !== difficultyValue)) {
          settingGetFailed = true;
        }

        settings = { difficulty: settings.difficulty, minesCount, sounds: settings.sounds };
      }
    } else {
      settingGetFailed = true;
    }

    if (settingGetFailed) {
      settings = { difficulty: gameDifficulties.easy, minesCount: 10, sounds: true };
      localStorage.setItem('settings', JSON.stringify(settings));
    }
    return settings;
  }

  static set(difficulty, minesCount, sounds) {
    const settings = GameSettings.get();
    localStorage.setItem('settings', JSON.stringify({ difficulty, minesCount, sounds }));
    if (settings.difficulty.value !== difficulty.value || settings.minesCount !== minesCount) {
      GameSettings.mineFieldChanged();
    }

    if (settings.sounds !== sounds) {
      GameSettings.soundMuteChanged();
    }
  }
}

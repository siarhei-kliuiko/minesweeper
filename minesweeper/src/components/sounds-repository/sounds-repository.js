import gameStartMusic from '../../assets/sounds/duck-hunt-intro.mp3';
import dogLaugh from '../../assets/sounds/laugh.mp3';
import cheerSound from '../../assets/sounds/cheer.mp3';
import shockSound from '../../assets/sounds/shock.mp3';
import explosionSound from '../../assets/sounds/boom.mp3';
import flagSound from '../../assets/sounds/flag.mp3';
import breezeSound from '../../assets/sounds/breeze.mp3';
import dogBarkSound from '../../assets/sounds/bark.mp3';
import { GameSettings } from '../game-settings/game-settings';

export const sounds = {
  gameStart: gameStartMusic,
  laugh: dogLaugh,
  cheer: cheerSound,
  bark: dogBarkSound,
  mine: shockSound,
  explosion: explosionSound,
  flag: flagSound,
  breeze: breezeSound,
};

export class SoundsRepository {
  static isMuted = !GameSettings.get().sounds;

  static createSound(sound) {
    const result = new Audio(sound);
    result.volume = SoundsRepository.isMuted ? 0 : 1;
    return result;
  }

  static toggleMute() {
    SoundsRepository.isMuted = !SoundsRepository.isMuted;
  }
}

GameSettings.soundMuteChanged = SoundsRepository.toggleMute;

import Overlay from '../overlay/overlay';
import './message-box.scss';

export default class MessageBox {
  static show(content) {
    const box = document.createElement('div');
    box.className = 'message-box';
    const okButton = document.createElement('button');
    okButton.innerText = 'ОК';
    okButton.className = 'button message-box__button';
    box.append(content, okButton);
    const overlay = new Overlay(box);
    okButton.addEventListener('click', () => {
      overlay.close();
    }, { once: true });
  }

  static showMessage(text) {
    const message = document.createElement('h2');
    message.className = 'message-box__text';
    message.innerText = text;
    this.show(message);
  }
}

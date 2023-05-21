import Overlay from '../overlay/overlay';
import './message-box.scss';
import createButton from '../button/button';

export default class MessageBox {
  static show(content) {
    const box = document.createElement('div');
    box.className = 'message-box';
    const overlay = new Overlay(box);
    const okButton = createButton('OK', 'message-box__button', () => {
      overlay.close();
    });
    box.append(content, okButton);
  }

  static showMessage(text) {
    const message = document.createElement('h2');
    message.className = 'message-box__text';
    message.innerText = text;
    this.show(message);
  }
}

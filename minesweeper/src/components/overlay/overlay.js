import './overlay-style.scss';

export default class Overlay {
  constructor(popup) {
    this.htmlElement = document.createElement('div');
    this.htmlElement.className = 'overlay';
    if (popup) {
      this.htmlElement.append(popup);
    }

    const bodyWidthWithScrollbar = document.body.clientWidth;
    document.body.classList.toggle('scroll-disable');
    const verticalScrollBarWidth = document.body.clientWidth - bodyWidthWithScrollbar;
    if (verticalScrollBarWidth) {
      document.body.style.paddingRight = `${verticalScrollBarWidth}px`;
    }

    document.body.prepend(this.htmlElement);
  }

  close() {
    this.htmlElement.remove();
    document.body.classList.toggle('scroll-disable');
    document.body.style.paddingRight = '';
  }
}

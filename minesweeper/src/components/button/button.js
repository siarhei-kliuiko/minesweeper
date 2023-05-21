import './button-style.scss';

const createButton = (htmlElement, className, onClickCallback) => {
  const button = document.createElement('button');
  button.append(htmlElement);
  button.className = `button ${className}`;
  button.addEventListener('click', () => {
    onClickCallback();
  });

  return button;
};

export default createButton;

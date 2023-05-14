import './bush-style.scss';

const createBush = (className) => {
  const bush = document.createElement('div');
  bush.className = `bush ${className} bush_animation_idle`;
  return bush;
};

export default createBush;

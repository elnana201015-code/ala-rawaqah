const exploreBtn = document.getElementById('exploreBtn');
const hasAccountBtn = document.getElementById('hasAccountBtn');

function addPressEffect(btn) {
  if (!btn) return;
  btn.addEventListener('touchstart', () => btn.classList.add('pressed'), { passive: true });
  btn.addEventListener('touchend', () => setTimeout(() => btn.classList.remove('pressed'), 120));
  btn.addEventListener('mousedown', () => btn.classList.add('pressed'));
  btn.addEventListener('mouseup', () => setTimeout(() => btn.classList.remove('pressed'), 120));
  btn.addEventListener('mouseleave', () => btn.classList.remove('pressed'));
}

addPressEffect(exploreBtn);
addPressEffect(hasAccountBtn);

if (exploreBtn) {
  exploreBtn.addEventListener('click', () => {
    exploreBtn.classList.add('pressed');
    setTimeout(() => {
      window.location.href = 'register.html';
    }, 130);
  });
}

if (hasAccountBtn) {
  hasAccountBtn.addEventListener('click', () => {
    hasAccountBtn.classList.add('pressed');
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 130);
  });
}

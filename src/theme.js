export function getTheme() {
  return localStorage.getItem('kashi_theme') || 'light';
}

export function setTheme(theme) {
  document.body.setAttribute('data-theme', theme);
  localStorage.setItem('kashi_theme', theme);
}

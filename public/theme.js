// Apply the same explicit display preference on static destinations before paint.
try {
  const choice = localStorage.getItem('sc-theme')
  if (choice === 'light' || choice === 'dark') document.documentElement.dataset.theme = choice
} catch { /* Storage may be unavailable; CSS follows system preference. */ }

// Native details stay usable without JavaScript; enhance dismissal when available.
document.addEventListener('DOMContentLoaded', () => {
  const menu = document.querySelector('.detail-menu')
  if (!menu) return
  const summary = menu.querySelector('summary')
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu.open) {
      menu.open = false
      summary.focus()
    }
  })
  document.addEventListener('pointerdown', event => {
    if (menu.open && !menu.contains(event.target)) menu.open = false
  })
  menu.addEventListener('focusout', event => {
    if (event.relatedTarget && !menu.contains(event.relatedTarget)) menu.open = false
  })
  menu.addEventListener('click', event => {
    if (event.target.closest('a')) menu.open = false
  })
})

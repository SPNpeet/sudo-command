// Apply the same explicit display preference on static destinations before paint.
try {
  const choice = localStorage.getItem('sc-theme')
  if (choice === 'light' || choice === 'dark') document.documentElement.dataset.theme = choice
} catch { /* Storage may be unavailable; CSS follows system preference. */ }

function showDetailsElementOnPrint() {
  document.querySelectorAll('.app-notes-expander').forEach(details => {
    details.setAttribute('open', '')
  })
}

window.addEventListener('beforeprint', () => showDetailsElementOnPrint())

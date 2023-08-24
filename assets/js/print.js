function showDetailsElementOnPrint() {
  document.querySelectorAll('.app-notes-expander').forEach(details => {
    details.setAttribute('open', '')
  })
}

function showPrintWindow() {
  window.print()
}

window.addEventListener('beforeprint', () => showDetailsElementOnPrint())
document.getElementById('print-link').addEventListener('click', () => showPrintWindow())

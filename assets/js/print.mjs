const initPrintLinks = () => {
  /**
   * Expand all the Overview notes details elements on print
   */
  const showDetailsElementOnPrint = () => {
    document.querySelectorAll('.app-notes-expander').forEach(details => {
      details.setAttribute('open', '')
    })
  }

  window.addEventListener('beforeprint', showDetailsElementOnPrint)

  /**
   * Handle the print page link event
   */
  const printLink = document.getElementById('print-link')

  const showPrintWindow = () => {
    window.print()
  }

  // Check that the print link exists before executing the event listener
  if (printLink) {
    printLink.addEventListener('click', showPrintWindow)
  }
}

export default initPrintLinks

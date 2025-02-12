const initBackLinks = () => {
  const backLink = document.querySelector('.js-back-link')
  if (backLink) {
    backLink.addEventListener(
      'click',
      e => {
        window.history.back()
        e.preventDefault()
      },
      false,
    )
  }
}

export default initBackLinks

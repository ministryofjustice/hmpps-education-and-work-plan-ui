const backLink = document.querySelector('.js-back-link')
if (backLink) {
  backLink.addEventListener(
    'click',
    function (e) {
      window.history.back()
      e.preventDefault()
    },
    false,
  )
}

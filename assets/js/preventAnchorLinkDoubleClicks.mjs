const preventAnchorLinkDoubleClicks = () => {
  document.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', _evt => {
      link.classList.add('disable-link')
      setTimeout(() => link.classList.remove('disable-link'), 1000)
    })
  })
}

export default preventAnchorLinkDoubleClicks

const initWhatsNewBanner = () => {
  const whatsNewBanner = document.getElementById('whats-new-banner')

  if (whatsNewBanner) {
    whatsNewBanner.querySelector('.whats-new-hide-message').addEventListener('click', () => {
      localStorage.setItem('whatsNewBannerVersionRead', whatsNewBanner.dataset.bannerVersion)
      whatsNewBanner.classList.add('moj-hidden')
    })

    window.addEventListener('load', () => {
      const { whatsNewBannerVersionRead } = localStorage
      const currentBannerVersion = whatsNewBanner.dataset.bannerVersion

      if (whatsNewBannerVersionRead !== currentBannerVersion) {
        whatsNewBanner.classList.remove('moj-hidden')
      }
    })
  }
}

export default initWhatsNewBanner

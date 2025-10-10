import Page from '../../pages/page'
import SkillsPage from '../../pages/induction/SkillsPage'
import SkillsValue from '../../../server/enums/skillsValue'

context('Update Skills within an Induction - Handle API errors', () => {
  const prisonNumber = 'G6115VJ'

  beforeEach(() => {
    cy.signInAsUserWithManagerAuthorityToArriveOnSessionSummaryPage()
    cy.task('stubGetInduction', prisonNumber)
  })

  it('should redisplay Skills page with a suitable error message given the API returns a 400 Bad Request error', () => {
    // Given
    cy.task('stubUpdateInduction400Error', prisonNumber)

    cy.visit(`/prisoners/${prisonNumber}/induction/skills`)
    const skillsPage = Page.verifyOnPage(SkillsPage)

    // When
    skillsPage //
      .apiErrorBannerIsNotDisplayed()
      .selectSkill(SkillsValue.SELF_MANAGEMENT)
      .submitPage()

    // Then
    Page.verifyOnPage(SkillsPage) //
      .apiErrorBannerIsDisplayed()
  })

  it('should redisplay Skills page with a suitable error message given the API returns a 500 error', () => {
    // Given
    cy.task('stubUpdateInduction500Error', prisonNumber)

    cy.visit(`/prisoners/${prisonNumber}/induction/skills`)
    const skillsPage = Page.verifyOnPage(SkillsPage)

    // When
    skillsPage //
      .apiErrorBannerIsNotDisplayed()
      .selectSkill(SkillsValue.SELF_MANAGEMENT)
      .submitPage()

    // Then
    Page.verifyOnPage(SkillsPage) //
      .apiErrorBannerIsDisplayed()
  })
})

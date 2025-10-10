import Page from '../../pages/page'
import AffectAbilityToWorkPage from '../../pages/induction/AffectAbilityToWorkPage'
import AbilityToWorkValue from '../../../server/enums/abilityToWorkValue'

context('Update factors affecting the ability to work within an Induction - Handle API errors', () => {
  const prisonNumber = 'G6115VJ'

  beforeEach(() => {
    cy.signInAsUserWithManagerAuthorityToArriveOnSessionSummaryPage()
    cy.task('stubGetInduction', prisonNumber)
  })

  it('should redisplay Factors Affecting Ability To Work page with a suitable error message given the API returns a 400 Bad Request error', () => {
    // Given
    cy.task('stubUpdateInduction400Error', prisonNumber)

    cy.visit(`/prisoners/${prisonNumber}/induction/affect-ability-to-work`)
    const affectAbilityToWorkPage = Page.verifyOnPage(AffectAbilityToWorkPage)

    // When
    affectAbilityToWorkPage //
      .apiErrorBannerIsNotDisplayed()
      .selectAffectAbilityToWork(AbilityToWorkValue.NEEDS_WORK_ADJUSTMENTS_DUE_TO_HEALTH)
      .submitPage()

    // Then
    Page.verifyOnPage(AffectAbilityToWorkPage) //
      .apiErrorBannerIsDisplayed()
  })

  it('should redisplay Factors Affecting Ability To Work page with a suitable error message given the API returns a 500 error', () => {
    // Given
    cy.task('stubUpdateInduction500Error', prisonNumber)

    cy.visit(`/prisoners/${prisonNumber}/induction/affect-ability-to-work`)
    const affectAbilityToWorkPage = Page.verifyOnPage(AffectAbilityToWorkPage)

    // When
    affectAbilityToWorkPage //
      .apiErrorBannerIsNotDisplayed()
      .selectAffectAbilityToWork(AbilityToWorkValue.NEEDS_WORK_ADJUSTMENTS_DUE_TO_HEALTH)
      .submitPage()

    // Then
    Page.verifyOnPage(AffectAbilityToWorkPage) //
      .apiErrorBannerIsDisplayed()
  })
})

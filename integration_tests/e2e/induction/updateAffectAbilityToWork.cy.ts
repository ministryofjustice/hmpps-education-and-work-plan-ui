import Page from '../../pages/page'
import AffectAbilityToWorkPage from '../../pages/induction/AffectAbilityToWorkPage'
import WorkAndInterestsPage from '../../pages/overview/WorkAndInterestsPage'
import AbilityToWorkValue from '../../../server/enums/abilityToWorkValue'
import { putRequestedFor } from '../../mockApis/wiremock/requestPatternBuilder'
import { urlEqualTo } from '../../mockApis/wiremock/matchers/url'
import { matchingJsonPath } from '../../mockApis/wiremock/matchers/content'

context('Update factors affecting the ability to work within an Induction', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignInAsUserWithEditAuthority')
    cy.task('stubAuthUser')
    cy.task('stubGetHeaderComponent')
    cy.task('stubGetFooterComponent')
    cy.task('stubPrisonerList')
    cy.task('stubCiagInductionList')
    cy.task('stubActionPlansList')
    cy.task('getPrisonerById')
    cy.task('getActionPlan')
    cy.task('stubLearnerProfile')
    cy.task('stubLearnerEducation')
    cy.task('stubUpdateInduction')
    cy.task('stubGetInductionLongQuestionSet')
    cy.signIn()
  })

  it('should update affect ability to work given page submitted with changed values and no validation errors', () => {
    // Given
    const prisonNumber = 'G6115VJ'
    cy.visit(`/prisoners/${prisonNumber}/induction/affect-ability-to-work`)
    const affectAbilityToWorkPage = Page.verifyOnPage(AffectAbilityToWorkPage)
      .hasBackLinkTo(`/plan/${prisonNumber}/view/work-and-interests`)
      .backLinkHasAriaLabel(`Back to Daniel Craig's learning and work progress`)

    // When
    affectAbilityToWorkPage //
      .deSelectAffectAbilityToWork(AbilityToWorkValue.LIMITED_BY_OFFENCE)
      .deSelectAffectAbilityToWork(AbilityToWorkValue.NEEDS_WORK_ADJUSTMENTS_DUE_TO_HEALTH)
      .chooseAffectAbilityToWork(AbilityToWorkValue.NEEDS_WORK_ADJUSTMENTS_DUE_TO_HEALTH)
      .chooseAffectAbilityToWork(AbilityToWorkValue.OTHER)
      .setAffectAbilityToWorkOther('Variable mental health')
      .submitPage()

    // Then
    Page.verifyOnPage(WorkAndInterestsPage)
    cy.wiremockVerify(
      putRequestedFor(urlEqualTo(`/inductions/${prisonNumber}`)) //
        .withRequestBody(
          matchingJsonPath(
            '$[?(@.workOnRelease.affectAbilityToWork.size() == 2 && ' +
              "@.workOnRelease.affectAbilityToWork[0] == 'NEEDS_WORK_ADJUSTMENTS_DUE_TO_HEALTH' && " +
              "@.workOnRelease.affectAbilityToWork[1] == 'OTHER' && " +
              "@.workOnRelease.affectAbilityToWorkOther == 'Variable mental health')]",
          ),
        ),
    )
  })

  it('should update affect ability to work given page submitted with values changed to NONE and no validation errors', () => {
    // Given
    const prisonNumber = 'G6115VJ'
    cy.visit(`/prisoners/${prisonNumber}/induction/affect-ability-to-work`)
    const affectAbilityToWorkPage = Page.verifyOnPage(AffectAbilityToWorkPage)

    // When
    affectAbilityToWorkPage //
      .chooseAffectAbilityToWork(AbilityToWorkValue.NONE)
      .submitPage()

    // Then
    Page.verifyOnPage(WorkAndInterestsPage)
    cy.wiremockVerify(
      putRequestedFor(urlEqualTo(`/inductions/${prisonNumber}`)) //
        .withRequestBody(
          matchingJsonPath(
            "$[?(@.workOnRelease.affectAbilityToWork.size() == 1 && @.workOnRelease.affectAbilityToWork[0] == 'NONE')]",
          ),
        ),
    )
  })

  it('should not update affect ability to work given page submitted with validation errors', () => {
    // Given
    const prisonNumber = 'G6115VJ'
    cy.visit(`/prisoners/${prisonNumber}/induction/affect-ability-to-work`)
    let affectAbilityToWorkPage = Page.verifyOnPage(AffectAbilityToWorkPage)

    // When
    affectAbilityToWorkPage //
      .chooseAffectAbilityToWork(AbilityToWorkValue.OTHER)
      .clearAffectAbilityToWorkOther()
      .submitPage()

    // Then
    affectAbilityToWorkPage = Page.verifyOnPage(AffectAbilityToWorkPage)
    affectAbilityToWorkPage.hasFieldInError('affectAbilityToWorkOther')
    cy.wiremockVerifyNoInteractions(putRequestedFor(urlEqualTo(`/inductions/${prisonNumber}`)))
  })
})

import Page from '../../pages/page'
import InPrisonWorkPage from '../../pages/induction/InPrisonWorkPage'
import InPrisonWorkValue from '../../../server/enums/inPrisonWorkValue'
import EducationAndTrainingPage from '../../pages/overview/EducationAndTrainingPage'
import AuthorisationErrorPage from '../../pages/authorisationError'
import Error404Page from '../../pages/error404'

context('Update single question in the Induction', () => {
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
  })

  describe('short question set Inductions', () => {
    beforeEach(() => {
      cy.task('stubGetInductionShortQuestionSet')
      cy.signIn()
    })

    it('should update Induction given page submitted with no validation errors', () => {
      // Given
      const prisonNumber = 'G6115VJ'
      cy.visit(`/prisoners/${prisonNumber}/induction/in-prison-work`)
      const inPrisonWorkPage = Page.verifyOnPage(InPrisonWorkPage)

      // When
      inPrisonWorkPage //
        .chooseWorkType(InPrisonWorkValue.CLEANING_AND_HYGIENE)
        .chooseWorkType(InPrisonWorkValue.OTHER)
        .setOtherWorkType('Painting and decorating')
        .submitPage()

      // Then
      Page.verifyOnPage(EducationAndTrainingPage)
      // TODO assert the API was called with the correct data - we would expect the update request to have in prison work as
      //  CLEANING_AND_HYGIENE, MAINTENANCE (as MAINTENANCE was already on the Induction), and OTHER with the value 'Painting and decorating'
    })

    it('should not update Induction given page submitted with validation errors', () => {
      // Given
      const prisonNumber = 'G6115VJ'
      cy.visit(`/prisoners/${prisonNumber}/induction/in-prison-work`)
      let inPrisonWorkPage = Page.verifyOnPage(InPrisonWorkPage)

      // When
      inPrisonWorkPage //
        .chooseWorkType(InPrisonWorkValue.OTHER)
        .clearOtherWorkType()
        .submitPage()

      // Then
      inPrisonWorkPage = Page.verifyOnPage(InPrisonWorkPage)
      inPrisonWorkPage.hasFieldInError('inPrisonWorkOther')
      // TODO assert the API was not called
    })
  })

  describe('long question set Inductions', () => {})

  describe('questions common to both short and long question set Inductions', () => {
    it('should redirect to 404 page given prisoner does not have an induction', () => {
      // Given
      cy.task('stubGetInduction404Error')
      cy.signIn()
      const prisonNumber = 'G6115VJ'

      // When
      cy.visit(`/prisoners/${prisonNumber}/induction/in-prison-work`, { failOnStatusCode: false })

      // Then
      Page.verifyOnPage(Error404Page)
    })

    it('should redirect to auth-error page given user does not have any authorities', () => {
      // Given
      cy.task('stubSignIn')
      cy.signIn()

      const prisonNumber = 'G6115VJ'

      // When
      cy.visit(`/prisoners/${prisonNumber}/induction/in-prison-work`, { failOnStatusCode: false })

      // Then
      Page.verifyOnPage(AuthorisationErrorPage)
    })

    it('should redirect to auth-error page given user does not have edit authority', () => {
      // Given
      cy.task('stubSignInAsUserWithViewAuthority')
      cy.signIn()

      const prisonNumber = 'G6115VJ'

      // When
      cy.visit(`/prisoners/${prisonNumber}/induction/in-prison-work`, { failOnStatusCode: false })

      // Then
      Page.verifyOnPage(AuthorisationErrorPage)
    })
  })
})

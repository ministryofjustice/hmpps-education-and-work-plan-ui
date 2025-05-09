import { v4 as uuidV4 } from 'uuid'
import Page from '../../pages/page'
import OverviewPage from '../../pages/overview/OverviewPage'
import CheckYourAnswersPage from '../../pages/induction/CheckYourAnswersPage'
import CreateGoalsPage from '../../pages/goal/CreateGoalsPage'
import HasWorkedBeforeValue from '../../../server/enums/hasWorkedBeforeValue'
import HopingToGetWorkValue from '../../../server/enums/hopingToGetWorkValue'
import { postRequestedFor } from '../../mockApis/wiremock/requestPatternBuilder'
import { urlEqualTo } from '../../mockApis/wiremock/matchers/url'

context('Prevent out of sequence navigation to pages in the Create Induction journey', () => {
  const prisonNumberForPrisonerWithNoInduction = 'A00001A'

  beforeEach(() => {
    cy.signInAsUserWithManagerAuthorityToArriveOnSessionSummaryPage()

    cy.task('stubGetAllPrisons')
    cy.task('getActionPlan', prisonNumberForPrisonerWithNoInduction)
    cy.task('getPrisonerById', prisonNumberForPrisonerWithNoInduction)
    cy.task('stubLearnerProfile', prisonNumberForPrisonerWithNoInduction)
    cy.task('stubLearnerEducation', prisonNumberForPrisonerWithNoInduction)
    cy.task('stubGetInduction404Error', prisonNumberForPrisonerWithNoInduction)
    cy.task('stubGetEducation404Error', prisonNumberForPrisonerWithNoInduction)
    cy.task('stubCreateInduction', prisonNumberForPrisonerWithNoInduction)
  })

  it('should redirect to the overview page when the user has completed the Induction question set, but tries to navigate back to the Induction journey from the Create Goals journey', () => {
    // Given
    cy.createInductionToArriveOnCheckYourAnswers({
      prisonNumber: prisonNumberForPrisonerWithNoInduction,
      hopingToGetWork: HopingToGetWorkValue.NO,
      hasWorkedBefore: HasWorkedBeforeValue.NO,
      withQualifications: false,
    })
    Page.verifyOnPage(CheckYourAnswersPage) //
      .submitPage()

    // assert we are on the Create Goals page and that a call to the API has been made to save the Induction
    Page.verifyOnPage(CreateGoalsPage)
    cy.wiremockVerify(postRequestedFor(urlEqualTo(`/inductions/${prisonNumberForPrisonerWithNoInduction}`)))

    // When
    // User attempts to navigate back with the browser back button to Check Your Answers, but we do not support that so redirect to Overview
    cy.go('back')

    // Then
    Page.verifyOnPage(OverviewPage)
  })
  ;[
    'want-to-add-qualifications',
    'qualifications',
    'highest-level-of-education',
    'qualification-level',
    'qualification-details',
    'additional-training',
    'has-worked-before',
    'previous-work-experience',
    'previous-work-experience/:typeOfWorkExperience',
    'work-interest-types',
    'work-interest-roles',
    'skills',
    'personal-interests',
    'affect-ability-to-work',
    'in-prison-work',
    'in-prison-training',
    'who-completed-induction',
    'notes',
    'check-your-answers',
  ].forEach(page => {
    it(`should prevent direct navigation to ${page} page when the user has not started the Create Induction journey`, () => {
      // Given
      const journeyId = uuidV4()

      // When
      cy.visit(`/prisoners/${prisonNumberForPrisonerWithNoInduction}/create-induction/${journeyId}/${page}`)

      // Then
      Page.verifyOnPage(OverviewPage)
    })
  })
})

import Page from '../../pages/page'
import EmployabilitySkillsPage from '../../pages/overview/EmployabilitySkillsPage'
import EmployabilitySkillsValue from '../../../server/enums/employabilitySkillsValue'
import EmployabilitySkillRatingsPage from '../../pages/employabilitySkills/EmployabilitySkillRatingsPage'
import Error404Page from '../../pages/error404'

context('View employability skill rating', () => {
  const prisonNumber = 'G6115VJ'

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignInAsReadOnlyUser')
    cy.task('getPrisonerById')
    cy.task('stubLearnerAssessments')
    cy.task('stubLearnerQualifications')
    cy.task('stubGetInduction')
    cy.task('getActionPlan')
    cy.task('stubGetAllPrisons')
    cy.task('stubGetConditions')
    cy.task('stubGetSupportStrategies')
    cy.task('stubGetChallenges')
    cy.task('stubGetStrengths')
    cy.task('stubGetAlnScreeners')
    cy.task('stubGetEmployabilitySkills')
    cy.signIn()
  })

  it('should be able to view all employability skills ratings', () => {
    // Given
    cy.task('stubGetEmployabilitySkills') // stub has skill ratings recorded for Organisaton and Problem Solving. These are the only 2 where we expect to see any data

    // When
    cy.visit(`/plan/${prisonNumber}/view/employability-skills`)

    // Then
    Page.verifyOnPage(EmployabilitySkillsPage) //
      .clickToViewSkillRatings(EmployabilitySkillsValue.ADAPTABILITY)
    Page.verifyOnPage(EmployabilitySkillRatingsPage) //
      .isForSkill(EmployabilitySkillsValue.ADAPTABILITY)
      .hasNoSkillRatingsRecorded() // stub has no skill ratings recorded for this type
    cy.go('back')

    Page.verifyOnPage(EmployabilitySkillsPage) //
      .clickToViewSkillRatings(EmployabilitySkillsValue.TEAMWORK)
    Page.verifyOnPage(EmployabilitySkillRatingsPage) //
      .isForSkill(EmployabilitySkillsValue.TEAMWORK)
      .hasNoSkillRatingsRecorded() // stub has no skill ratings recorded for this type
    cy.go('back')

    Page.verifyOnPage(EmployabilitySkillsPage) //
      .clickToViewSkillRatings(EmployabilitySkillsValue.TIMEKEEPING)
    Page.verifyOnPage(EmployabilitySkillRatingsPage) //
      .isForSkill(EmployabilitySkillsValue.TIMEKEEPING)
      .hasNoSkillRatingsRecorded() // stub has no skill ratings recorded for this type
    cy.go('back')

    Page.verifyOnPage(EmployabilitySkillsPage) //
      .clickToViewSkillRatings(EmployabilitySkillsValue.PLANNING)
    Page.verifyOnPage(EmployabilitySkillRatingsPage) //
      .isForSkill(EmployabilitySkillsValue.PLANNING)
      .hasNoSkillRatingsRecorded() // stub has no skill ratings recorded for this type
    cy.go('back')

    Page.verifyOnPage(EmployabilitySkillsPage) //
      .clickToViewSkillRatings(EmployabilitySkillsValue.ORGANISATION)
    Page.verifyOnPage(EmployabilitySkillRatingsPage) //
      .isForSkill(EmployabilitySkillsValue.ORGANISATION)
      .hasSkillRatingsDisplayed(EmployabilitySkillsValue.ORGANISATION)
    cy.go('back')

    Page.verifyOnPage(EmployabilitySkillsPage) //
      .clickToViewSkillRatings(EmployabilitySkillsValue.COMMUNICATION)
    Page.verifyOnPage(EmployabilitySkillRatingsPage) //
      .isForSkill(EmployabilitySkillsValue.COMMUNICATION)
      .hasNoSkillRatingsRecorded() // stub has no skill ratings recorded for this type
    cy.go('back')

    Page.verifyOnPage(EmployabilitySkillsPage) //
      .clickToViewSkillRatings(EmployabilitySkillsValue.CREATIVITY)
    Page.verifyOnPage(EmployabilitySkillRatingsPage) //
      .isForSkill(EmployabilitySkillsValue.CREATIVITY)
      .hasNoSkillRatingsRecorded() // stub has no skill ratings recorded for this type
    cy.go('back')

    Page.verifyOnPage(EmployabilitySkillsPage) //
      .clickToViewSkillRatings(EmployabilitySkillsValue.RELIABILITY)
    Page.verifyOnPage(EmployabilitySkillRatingsPage) //
      .isForSkill(EmployabilitySkillsValue.RELIABILITY)
      .hasNoSkillRatingsRecorded() // stub has no skill ratings recorded for this type
    cy.go('back')

    Page.verifyOnPage(EmployabilitySkillsPage) //
      .clickToViewSkillRatings(EmployabilitySkillsValue.INITIATIVE)
    Page.verifyOnPage(EmployabilitySkillRatingsPage) //
      .isForSkill(EmployabilitySkillsValue.INITIATIVE)
      .hasNoSkillRatingsRecorded() // stub has no skill ratings recorded for this type
    cy.go('back')

    Page.verifyOnPage(EmployabilitySkillsPage) //
      .clickToViewSkillRatings(EmployabilitySkillsValue.PROBLEM_SOLVING)
    Page.verifyOnPage(EmployabilitySkillRatingsPage) //
      .isForSkill(EmployabilitySkillsValue.PROBLEM_SOLVING)
      .hasSkillRatingsDisplayed(EmployabilitySkillsValue.PROBLEM_SOLVING)
  })

  Array.from(Object.keys(EmployabilitySkillsValue)).forEach((skillType: EmployabilitySkillsValue) => {
    it(`should be able to navigate directly to the ${skillType} skill ratings page`, () => {
      // Given

      // When
      cy.visit(`/plan/${prisonNumber}/employability-skills/${skillType}`)

      // Then
      Page.verifyOnPage(EmployabilitySkillRatingsPage) //
        .isForSkill(skillType)
        .apiErrorBannerIsNotDisplayed()
    })
  })

  it('should not be able to navigate to a skill ratings page for a non-existent skill type', () => {
    // Given
    const skillType = 'non-existent-skill-type'

    // When
    cy.visit(`/plan/${prisonNumber}/employability-skills/${skillType}`, { failOnStatusCode: false })

    // Then
    Page.verifyOnPage(Error404Page)
  })

  it('should display employability skills unavailable message given employability skills API is unavailable', () => {
    // Given
    cy.task('stubGetEmployabilitySkills500Error')

    // When
    cy.visit(`/plan/${prisonNumber}/employability-skills/PROBLEM_SOLVING`)

    // Then
    Page.verifyOnPage(EmployabilitySkillRatingsPage) //
      .isForSkill(EmployabilitySkillsValue.PROBLEM_SOLVING)
      .apiErrorBannerIsDisplayed()
      .hasEmployabilitySkillsUnavailableMessageDisplayed()
  })
})

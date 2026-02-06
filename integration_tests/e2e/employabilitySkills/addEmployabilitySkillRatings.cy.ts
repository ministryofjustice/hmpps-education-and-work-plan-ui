import Page from '../../pages/page'
import EmployabilitySkillsValue from '../../../server/enums/employabilitySkillsValue'
import AddEmployabilitySkillRatingsPage from '../../pages/employabilitySkills/AddEmployabilitySkillRatingsPage'
import EmployabilitySkillsPage from '../../pages/overview/EmployabilitySkillsPage'
import EmployabilitySkillRatingValue from '../../../server/enums/employabilitySkillRatingValue'
import { postRequestedFor } from '../../mockApis/wiremock/requestPatternBuilder'
import { urlEqualTo } from '../../mockApis/wiremock/matchers/url'
import { matchingJsonPath } from '../../mockApis/wiremock/matchers/content'

context('Add employability skill rating', () => {
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
    cy.task('stubCreateEmployabilitySkillRatings')
    cy.signIn()
  })

  Array.from(Object.keys(EmployabilitySkillsValue)).forEach((skillType: EmployabilitySkillsValue) => {
    it(`should be able to navigate directly to the add rating page for the ${skillType} skill`, () => {
      // Given

      // When
      cy.visit(`/plan/${prisonNumber}/employability-skills/${skillType}/add`)

      // Then
      Page.verifyOnPage(AddEmployabilitySkillRatingsPage) //
        .isForSkill(skillType)
        .apiErrorBannerIsNotDisplayed()
    })
  })

  it('should add skill rating, triggering validation on every question', () => {
    // Given
    cy.visit(`/plan/${prisonNumber}/view/employability-skills`)
    Page.verifyOnPage(EmployabilitySkillsPage) //
      .clickToAddSkillRatings(EmployabilitySkillsValue.ORGANISATION)

    // When
    Page.verifyOnPage(AddEmployabilitySkillRatingsPage) //
      .isForSkill(EmployabilitySkillsValue.ORGANISATION)
      // submit page without answering any questions
      .submitPage()

    Page.verifyOnPage(AddEmployabilitySkillRatingsPage) //
      .isForSkill(EmployabilitySkillsValue.ORGANISATION)
      .hasErrorCount(2)
      .hasFieldInError('rating')
      .hasFieldInError('evidence')
      // answer the rating question, answer evidence with more characters than allowed
      .selectRating(EmployabilitySkillRatingValue.QUITE_CONFIDENT)
      .enterEvidence('a'.repeat(201))
      .submitPage()

    Page.verifyOnPage(AddEmployabilitySkillRatingsPage) //
      .isForSkill(EmployabilitySkillsValue.ORGANISATION)
      .hasErrorCount(1)
      .hasFieldInError('evidence')
      // answer the evidence field
      .enterEvidence(
        'Chris demonstrated their organisation skills in the Woodworking workshop by having a consistently tidy bench area',
      )
      .submitPage()

    // Then
    Page.verifyOnPage(EmployabilitySkillsPage) //
      .hasSuccessMessage('Organisation skill updated')

    cy.wiremockVerify(
      postRequestedFor(urlEqualTo(`/action-plans/${prisonNumber}/employability-skills`)) //
        .withRequestBody(
          matchingJsonPath(
            '$[?(' +
              '@.employabilitySkills.size() == 1' +
              " && @.employabilitySkills[0].prisonId == 'BXI'" +
              " && @.employabilitySkills[0].employabilitySkillType == 'ORGANISATION'" +
              " && @.employabilitySkills[0].employabilitySkillRating == 'QUITE_CONFIDENT'" +
              " && @.employabilitySkills[0].evidence == 'Chris demonstrated their organisation skills in the Woodworking workshop by having a consistently tidy bench area'" +
              ' && @.employabilitySkills[0].conversationDate == null' +
              ')]',
          ),
        ),
    )
  })

  it('should not add skill rating and redisplay Add Employability Skill Rating page given calling API is not successful', () => {
    // Given
    cy.task('stubCreateEmployabilitySkillRatings500Error')

    cy.visit(`/plan/${prisonNumber}/employability-skills/ORGANISATION/add`)

    // When
    Page.verifyOnPage(AddEmployabilitySkillRatingsPage) //
      .isForSkill(EmployabilitySkillsValue.ORGANISATION)
      .selectRating(EmployabilitySkillRatingValue.QUITE_CONFIDENT)
      .enterEvidence(
        'Chris demonstrated their organisation skills in the Woodworking workshop by having a consistently tidy bench area',
      )
      .submitPage()

    // Then
    Page.verifyOnPage(AddEmployabilitySkillRatingsPage) //
      .isForSkill(EmployabilitySkillsValue.ORGANISATION)
      .apiErrorBannerIsDisplayed()
  })
})

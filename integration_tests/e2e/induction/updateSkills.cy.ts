import Page from '../../pages/page'
import SkillsPage from '../../pages/induction/SkillsPage'
import WorkAndInterestsPage from '../../pages/overview/WorkAndInterestsPage'
import SkillsValue from '../../../server/enums/skillsValue'
import { putRequestedFor } from '../../mockApis/wiremock/requestPatternBuilder'
import { urlEqualTo } from '../../mockApis/wiremock/matchers/url'
import { matchingJsonPath } from '../../mockApis/wiremock/matchers/content'

context('Update Skills in the Induction', () => {
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

  it('should update Skills given page submitted with changed skills and no validation errors', () => {
    // Given
    const prisonNumber = 'G6115VJ'
    cy.visit(`/prisoners/${prisonNumber}/induction/skills`)
    const skillsPage = Page.verifyOnPage(SkillsPage)
      .hasBackLinkTo(`/plan/${prisonNumber}/view/work-and-interests`)
      .backLinkHasAriaLabel(`Back to Daniel Craig's learning and work progress`)

    // stubGetInductionLongQuestionSet has skills of Communication, Positive Attitude, Thinking & Problem Solving, and Other (Logical Thinking)

    // When
    skillsPage //
      .deSelectSkill(SkillsValue.COMMUNICATION)
      .deSelectSkill(SkillsValue.THINKING_AND_PROBLEM_SOLVING)
      .chooseSkill(SkillsValue.SELF_MANAGEMENT)
      .chooseSkill(SkillsValue.OTHER)
      .setOtherSkillType('Circus skills')
      .submitPage()

    // Then
    Page.verifyOnPage(WorkAndInterestsPage)
    cy.wiremockVerify(
      putRequestedFor(urlEqualTo(`/inductions/${prisonNumber}`)) //
        .withRequestBody(
          matchingJsonPath(
            '$[?(@.personalSkillsAndInterests.skills.size() == 3 && ' +
              "@.personalSkillsAndInterests.skills[0].skillType == 'POSITIVE_ATTITUDE' && !@.personalSkillsAndInterests.skills[0].skillTypeOther && " +
              "@.personalSkillsAndInterests.skills[1].skillType == 'SELF_MANAGEMENT' && !@.personalSkillsAndInterests.skills[1].skillTypeOther && " +
              "@.personalSkillsAndInterests.skills[2].skillType == 'OTHER' && @.personalSkillsAndInterests.skills[2].skillTypeOther == 'Circus skills')]",
          ),
        ),
    )
  })

  it('should update Skills given page submitted with changed skills values to NONE and no validation errors', () => {
    // Given
    const prisonNumber = 'G6115VJ'
    cy.visit(`/prisoners/${prisonNumber}/induction/skills`)
    const skillsPage = Page.verifyOnPage(SkillsPage)

    // stubGetInductionLongQuestionSet has skills of Communication, Positive Attitude, Thinking & Problem Solving, and Other (Logical Thinking)

    // When
    skillsPage //
      .chooseSkill(SkillsValue.NONE)
      .submitPage()

    // Then
    Page.verifyOnPage(WorkAndInterestsPage)
    cy.wiremockVerify(
      putRequestedFor(urlEqualTo(`/inductions/${prisonNumber}`)) //
        .withRequestBody(
          matchingJsonPath(
            '$[?(@.personalSkillsAndInterests.skills.size() == 1 && ' +
              "@.personalSkillsAndInterests.skills[0].skillType == 'NONE' && !@.personalSkillsAndInterests.skills[0].skillTypeOther)]",
          ),
        ),
    )
  })

  it('should not update Skills given page submitted with validation errors', () => {
    // Given
    const prisonNumber = 'G6115VJ'
    cy.visit(`/prisoners/${prisonNumber}/induction/skills`)
    let skillsPage = Page.verifyOnPage(SkillsPage)

    // When
    skillsPage //
      .chooseSkill(SkillsValue.OTHER)
      .clearOtherSkillType()
      .submitPage()

    // Then
    skillsPage = Page.verifyOnPage(SkillsPage)
    skillsPage.hasFieldInError('skillsOther')
    cy.wiremockVerifyNoInteractions(putRequestedFor(urlEqualTo(`/inductions/${prisonNumber}`)))
  })

  it('should update Skills given short question set induction that was created with no personal skills', () => {
    // Given
    const prisonNumber = 'G6115VJ'
    cy.task('stubGetInductionShortQuestionSetCreatedWithOriginalQuestionSet') // The original question set did not ask about personal skills for the Short question set
    cy.visit(`/plan/${prisonNumber}/view/work-and-interests`)
    Page.verifyOnPage(WorkAndInterestsPage) //
      .skillsChangeLinkHasText('Add')
      .clickSkillsChangeLink()

    // When
    Page.verifyOnPage(SkillsPage) //
      .chooseSkill(SkillsValue.SELF_MANAGEMENT)
      .chooseSkill(SkillsValue.OTHER)
      .setOtherSkillType('Circus skills')
      .submitPage()

    // Then
    Page.verifyOnPage(WorkAndInterestsPage)
    cy.wiremockVerify(
      putRequestedFor(urlEqualTo(`/inductions/${prisonNumber}`)) //
        .withRequestBody(
          matchingJsonPath(
            '$[?(@.personalSkillsAndInterests.skills.size() == 2 && ' +
              "@.personalSkillsAndInterests.skills[0].skillType == 'SELF_MANAGEMENT' && !@.personalSkillsAndInterests.skills[0].skillTypeOther && " +
              "@.personalSkillsAndInterests.skills[1].skillType == 'OTHER' && @.personalSkillsAndInterests.skills[1].skillTypeOther == 'Circus skills')]",
          ),
        ),
    )
  })
})

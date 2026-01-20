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
    cy.task('stubSignInAsUserWithManagerRole')
    cy.task('getPrisonerById')
    cy.task('stubLearnerAssessments')
    cy.task('stubLearnerQualifications')
    cy.task('stubUpdateInduction')
    cy.task('stubGetInduction')
    cy.signIn()
  })

  it('should update Skills given page submitted with changed skills and no validation errors', () => {
    // Given
    const prisonNumber = 'G6115VJ'
    cy.visit(`/prisoners/${prisonNumber}/induction/skills`)
    const skillsPage = Page.verifyOnPage(SkillsPage)

    // Induction has skills of Communication, Positive Attitude, Thinking & Problem Solving, and Other (Logical Thinking)

    // When
    skillsPage //
      .deSelectSkill(SkillsValue.COMMUNICATION)
      .deSelectSkill(SkillsValue.THINKING_AND_PROBLEM_SOLVING)
      .selectSkill(SkillsValue.SELF_MANAGEMENT)
      .selectSkill(SkillsValue.OTHER)
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

    // Induction has skills of Communication, Positive Attitude, Thinking & Problem Solving, and Other (Logical Thinking)

    // When
    skillsPage //
      .selectSkill(SkillsValue.NONE)
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
      .selectSkill(SkillsValue.OTHER)
      .clearOtherSkillType()
      .submitPage()

    // Then
    skillsPage = Page.verifyOnPage(SkillsPage)
    skillsPage.hasFieldInError('skillsOther')
    cy.wiremockVerifyNoInteractions(putRequestedFor(urlEqualTo(`/inductions/${prisonNumber}`)))
  })

  it('should update Skills given induction created with the original short question set which did not ask about personal skills', () => {
    // Given
    const prisonNumber = 'G6115VJ'
    cy.task('stubGetOriginalQuestionSetInduction', { questionSet: 'SHORT' }) // The original short question set Induction did not ask about personal skills
    cy.visit(`/plan/${prisonNumber}/view/work-and-interests`)
    Page.verifyOnPage(WorkAndInterestsPage) //
      .skillsChangeLinkHasText('Add')
      .clickSkillsChangeLink()

    // When
    Page.verifyOnPage(SkillsPage) //
      .selectSkill(SkillsValue.SELF_MANAGEMENT)
      .selectSkill(SkillsValue.OTHER)
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

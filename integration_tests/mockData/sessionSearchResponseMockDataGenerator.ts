import type { SessionSearchResponse } from 'educationAndWorkPlanApiClient'
import { addDays, format, startOfToday, subDays } from 'date-fns'
import SessionTypeValue from '../../server/enums/sessionTypeValue'
import SessionStatusValue from '../../server/enums/sessionStatusValue'
import ReviewScheduleStatusValue from '../../server/enums/reviewScheduleStatusValue'

/**
 * Generator function that can be called as a cypress task that generates and returns an array of random `SessionSearchResponse`
 * records, that can then in turn be used with cypress tasks that mock the Session Search API.
 * All generated `SessionSearchResponse` records will have a unique prison number.
 */
const sessionSearchResponseMockDataGenerator = (options?: {
  numberOfRecords?: number
  sessionStatus?: SessionStatusValue
}): Array<SessionSearchResponse> => {
  const uniquePrisonNumbers = generateUniquePrisonNumbers(options?.numberOfRecords || 500)
  const sessionStatus = options?.sessionStatus || SessionStatusValue.DUE

  return uniquePrisonNumbers.map(prisonNumber => ({
    prisonNumber,
    forename: randomForename(),
    surname: randomSurname(),
    dateOfBirth: randomDateOfBirth(),
    cellLocation: generateRandomLocation(),
    releaseDate: randomReleaseDate(),
    sessionType: randomReviewType(),
    deadlineDate:
      sessionStatus === SessionStatusValue.OVERDUE ? randomDeadlineDateInThePast() : randomDeadlineDateInTheFuture(),
    ...randomExemption(sessionStatus),
  }))
}

const generateUniquePrisonNumbers = (numberOfRecords: number): Array<string> => {
  const prisonNumbers = new Set<string>()
  while (prisonNumbers.size < numberOfRecords) {
    prisonNumbers.add(generatePrisonNumber())
  }
  return Array.from(prisonNumbers)
}

const generatePrisonNumber = (): string => `${randomLetters(1)}${randomNumbers(4)}${randomLetters(2)}`

const generateRandomLocation = (): string => `${randomLetters(1)}-${randomNumbers(4)}-${randomLetters(1)}`

const randomForename = (): string => FORENAMES[randomNumber(1, FORENAMES.length) - 1]

const randomSurname = (): string => SURNAMES[randomNumber(1, SURNAMES.length) - 1]

/**
 * Returns a random date sometime between 6570 days (18 years) and 25550 days (70 years) before today
 */
const randomDateOfBirth = (): string => format(subDays(startOfToday(), randomNumber(6570, 25550)), 'yyyy-MM-dd')

/**
 * Returns a random date sometime between 1 day and 365 days (1 year) before today.
 */
const randomDeadlineDateInThePast = (): string => format(subDays(startOfToday(), randomNumber(1, 365)), 'yyyy-MM-dd')

/**
 * Returns a random date sometime between 0 days and 60 days  after today.
 */
const randomDeadlineDateInTheFuture = (): string => format(addDays(startOfToday(), randomNumber(0, 60)), 'yyyy-MM-dd')

/**
 * Returns a random date sometime between 1 day and 60 days before today.
 */
const randomExemptionDate = (): string => format(subDays(startOfToday(), randomNumber(1, 60)), 'yyyy-MM-dd')

/**
 * Returns a random date sometime between 30 days and 5475 days (15 years) after today; or undefined.
 * Approximately 5% will return undefined, meaning the prisoner has no release date.
 */
const randomReleaseDate = (): string | undefined =>
  randomNumber(1, 100) > 5 ? format(addDays(startOfToday(), randomNumber(30, 5475)), 'yyyy-MM-dd') : undefined

const randomLetters = (numberOfLetters: number): string => {
  const letters: Array<string> = []
  for (let i = 0; i < numberOfLetters; i += 1) {
    letters.push(ALPHABET[randomNumber(1, 26) - 1])
  }
  return letters.join('')
}

const randomNumbers = (numberOfNumbers: number): string => {
  const numbers: Array<number> = []
  for (let i = 0; i < numberOfNumbers; i += 1) {
    numbers.push(randomNumber(0, 9))
  }
  return numbers.join('')
}

const randomNumber = (min: number, max: number): number => Math.floor(Math.random() * (max + 1 - min) + min)

const getRandomEnumValue = (enumeration: unknown) => {
  const values = Object.keys(enumeration)
  const enumKey = values[randomNumber(1, values.length) - 1]
  return enumeration[enumKey]
}

const randomReviewType = (): SessionTypeValue => {
  let reviewType: SessionTypeValue
  do {
    reviewType = getRandomEnumValue(SessionTypeValue)
  } while (reviewType === SessionTypeValue.INDUCTION)
  return reviewType
}

const randomExemption = (sessionStatus: SessionStatusValue): { exemptionReason?: string; exemptionDate?: string } =>
  sessionStatus === SessionStatusValue.ON_HOLD
    ? {
        exemptionReason: randomExemptionReason(),
        exemptionDate: randomExemptionDate(),
      }
    : {}

const randomExemptionReason = (): ReviewScheduleStatusValue => {
  let exemptionReason: ReviewScheduleStatusValue
  do {
    exemptionReason = getRandomEnumValue(ReviewScheduleStatusValue)
  } while (
    [
      ReviewScheduleStatusValue.COMPLETED,
      ReviewScheduleStatusValue.SCHEDULED,
      ReviewScheduleStatusValue.EXEMPT_PRISONER_DEATH,
      ReviewScheduleStatusValue.EXEMPT_PRISONER_TRANSFER,
      ReviewScheduleStatusValue.EXEMPT_PRISONER_RELEASE,
      ReviewScheduleStatusValue.EXEMPT_SYSTEM_TECHNICAL_ISSUE,
      ReviewScheduleStatusValue.EXEMPT_UNKNOWN,
    ].includes(exemptionReason)
  )
  return exemptionReason
}

const ALPHABET = [
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z',
]

const FORENAMES = [
  'BILL',
  'BEN',
  'MIKE',
  'MARK',
  'SIMON',
  'HARRY',
  'ALF',
  'ALBERT',
  'PAUL',
  'PETE',
  'PETER',
  'MARTIN',
  'FRED',
  'FRANK',
  'FREDERICK',
  'ROD',
  'RODNEY',
  'ROLF',
  'JAMES',
  'JIMMY',
  'STEVE',
  'STEPHEN',
  'JOHN',
  'OSCAR',
  'CHARLIE',
  'ROMEO',
  'JACK',
]

const SURNAMES = [
  'JONES',
  'SMITH',
  'BLOGGS',
  'HARRIS',
  'TWEED',
  'YELLOW',
  'BLUE',
  'RED',
  'DOCK',
  'BLOGS',
  'JAMESON',
  'TREE',
  'RAIN',
  'VAUXHALL',
  'FORD',
  'MONTEGO',
  'MINI',
  'GOLF',
  'TANGO',
  'ECHO',
  'FOXTROT',
  'LIMA',
  'JOHNSON',
  'JACKSON',
]

export default { generateSessionSearchResponses: sessionSearchResponseMockDataGenerator }

import type { PrisonerSearchSummary } from 'viewModels'
import moment from 'moment'

/**
 * Generator function that can be called as a cypress task that generates and returns an array of random `PrisonerSearchSummary`
 * records, that can then in turn be used with cypress tasks that mock prisoner-search, CIAG inductions, and PLP action plan APIs.
 * All generated `PrisonerSearchSummary` records will have a unique prison number.
 */
const prisonerSearchSummaryMockDataGenerator = (numberOfRecords = 500): Array<PrisonerSearchSummary> => {
  const uniquePrisonNumbers = generateUniquePrisonNumbers(numberOfRecords)

  return uniquePrisonNumbers.map(prisonNumber => {
    return {
      prisonNumber,
      prisonId: 'MDI',
      firstName: randomForename(),
      lastName: randomSurname(),
      dateOfBirth: randomDateOfBirth(),
      receptionDate: randomReceptionDate(),
      releaseDate: randomReleaseDate(),
      location: generateRandomLocation(),
      hasCiagInduction: randomNumber(0, 1) === 1,
      hasActionPlan: randomNumber(0, 1) === 1,
    }
  })
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
 * Returns a random date sometime between 6570 days (18 years) and 25550 days (70 years) years before today
 */
const randomDateOfBirth = (): Date => moment().subtract(randomNumber(6570, 25550), 'days').toDate()

/**
 * Returns a random date sometime between 1 day (yesterday) and 5475 days (15 years) years before today
 */
const randomReceptionDate = (): Date => moment().subtract(randomNumber(1, 5475), 'days').toDate()

/**
 * Returns a random date sometime between 30 days and 5475 days (15 years) years after today; or undefined.
 * Approximately 5% will return undefined, meaning the prisoner has no release date.
 */
const randomReleaseDate = (): Date | undefined =>
  randomNumber(1, 100) > 5 ? moment().add(randomNumber(30, 5475), 'days').toDate() : undefined

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
  'Z',
  'Y',
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
]

const SURNAMES = [
  'JONES',
  'SMITH',
  'BLOGGS',
  'HARRIS',
  'TWEED',
  'LIGHTFINGERS',
  'MCSHIFTY',
  'KNUCKLES',
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
]

export default { generatePrisonerSearchSummaries: prisonerSearchSummaryMockDataGenerator }

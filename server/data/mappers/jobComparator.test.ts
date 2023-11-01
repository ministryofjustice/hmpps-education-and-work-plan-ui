import type { Job, WorkInterestJob } from 'viewModels'
import { jobComparator, workInterestJobComparator } from './jobComparator'

describe('jobComparator', () => {
  describe('jobComparator', () => {
    it('should determine if 2 jobs have equal job types', () => {
      // Given
      const job1: Job = {
        type: 'CONSTRUCTION',
        role: 'Builder',
        responsibilities: 'General building',
      }
      const job2: Job = {
        type: 'CONSTRUCTION',
        role: 'Builders mate',
        responsibilities: 'General labouring and ground works',
      }

      // When
      const actual = jobComparator(job1, job2)

      // Then
      expect(actual).toEqual(0)
    })

    it(`should determine if a job's type is alphabetically before another job's type`, () => {
      // Given
      const job1: Job = {
        type: 'CONSTRUCTION',
        role: 'Builder',
        responsibilities: 'General building',
      }
      const job2: Job = {
        type: 'RETAIL',
        role: 'Shop assistant',
        responsibilities: 'Serving customers and stacking shelves',
      }

      // When
      const actual = jobComparator(job1, job2)

      // Then
      expect(actual).toEqual(-1)
    })

    it(`should determine if a job's type is alphabetically after another job's type`, () => {
      // Given
      const job1: Job = {
        type: 'RETAIL',
        role: 'Shop assistant',
        responsibilities: 'Serving customers and stacking shelves',
      }
      const job2: Job = {
        type: 'CONSTRUCTION',
        role: 'Builder',
        responsibilities: 'General building',
      }

      // When
      const actual = jobComparator(job1, job2)

      // Then
      expect(actual).toEqual(1)
    })

    it(`should return 1 given job with type 'OTHER' and another job's type is alphabetically before 'OTHER'`, () => {
      // Given
      const job1: Job = {
        type: 'OTHER',
        role: 'Dental technician',
        responsibilities: 'Drilling and filling',
      }
      const job2: Job = {
        type: 'CONSTRUCTION',
        role: 'Builder',
        responsibilities: 'General building',
      }

      // When
      const actual = jobComparator(job1, job2)

      // Then
      expect(actual).toEqual(1)
    })

    it(`should return 1 given job with type 'OTHER' and another job's type is alphabetically after 'OTHER'`, () => {
      // Given
      const job1: Job = {
        type: 'OTHER',
        role: 'Dental technician',
        responsibilities: 'Drilling and filling',
      }
      const job2: Job = {
        type: 'WAREHOUSING',
        role: 'Forklift driver',
        responsibilities: 'Stacking high shelves',
      }

      // When
      const actual = jobComparator(job1, job2)

      // Then
      expect(actual).toEqual(1)
    })

    it(`should return -1 given job with type alphabetically before 'OTHER' and another job's type is 'OTHER'`, () => {
      // Given
      const job1: Job = {
        type: 'CONSTRUCTION',
        role: 'Builder',
        responsibilities: 'General building',
      }
      const job2: Job = {
        type: 'OTHER',
        role: 'Dental technician',
        responsibilities: 'Drilling and filling',
      }

      // When
      const actual = jobComparator(job1, job2)

      // Then
      expect(actual).toEqual(-1)
    })

    it(`should return -1 given job with type alphabetically after 'OTHER' and another job's type is 'OTHER'`, () => {
      // Given
      const job1: Job = {
        type: 'WAREHOUSING',
        role: 'Forklift driver',
        responsibilities: 'Stacking high shelves',
      }
      const job2: Job = {
        type: 'OTHER',
        role: 'Dental technician',
        responsibilities: 'Drilling and filling',
      }

      // When
      const actual = jobComparator(job1, job2)

      // Then
      expect(actual).toEqual(-1)
    })

    it('should sort an array of Jobs alphabetically on type, but with OTHER at the end', () => {
      // Given
      const job1: Job = {
        type: 'RETAIL',
        role: 'Shop assistant',
        responsibilities: 'Serving customers and stacking shelves',
      }
      const job2: Job = {
        type: 'CONSTRUCTION',
        role: 'Builder',
        responsibilities: 'General building',
      }
      const job3: Job = {
        type: 'OTHER',
        role: 'Dental technician',
        responsibilities: 'Drilling and filling',
      }
      const job4: Job = {
        type: 'WAREHOUSING',
        role: 'Forklift driver',
        responsibilities: 'Stacking high shelves',
      }

      const jobs = [job1, job2, job3, job4]

      const expected = [job2, job1, job4, job3] // alphabetically on type, with OTHER at the end

      // When
      jobs.sort(jobComparator)

      // Then
      expect(jobs).toEqual(expected)
    })
  })

  describe('workInterestJobComparator', () => {
    it('should determine if 2 jobs have equal job types', () => {
      // Given
      const job1: WorkInterestJob = {
        jobType: 'CONSTRUCTION',
        specificJobRole: 'Builder',
      }
      const job2: WorkInterestJob = {
        jobType: 'CONSTRUCTION',
        specificJobRole: 'Builders mate',
      }

      // When
      const actual = workInterestJobComparator(job1, job2)

      // Then
      expect(actual).toEqual(0)
    })

    it(`should determine if a job's jobType is alphabetically before another job's jobType`, () => {
      // Given
      const job1: WorkInterestJob = {
        jobType: 'CONSTRUCTION',
        specificJobRole: 'Builder',
      }
      const job2: WorkInterestJob = {
        jobType: 'RETAIL',
        specificJobRole: 'Shop assistant',
      }

      // When
      const actual = workInterestJobComparator(job1, job2)

      // Then
      expect(actual).toEqual(-1)
    })

    it(`should determine if a job's jobType is alphabetically after another job's jobType`, () => {
      // Given
      const job1: WorkInterestJob = {
        jobType: 'RETAIL',
        specificJobRole: 'Shop assistant',
      }
      const job2: WorkInterestJob = {
        jobType: 'CONSTRUCTION',
        specificJobRole: 'Builder',
      }

      // When
      const actual = workInterestJobComparator(job1, job2)

      // Then
      expect(actual).toEqual(1)
    })

    it(`should return 1 given job with jobType 'OTHER' and another job's jobType is alphabetically before 'OTHER'`, () => {
      // Given
      const job1: WorkInterestJob = {
        jobType: 'OTHER',
        specificJobRole: 'Dental technician',
      }
      const job2: WorkInterestJob = {
        jobType: 'CONSTRUCTION',
        specificJobRole: 'Builder',
      }

      // When
      const actual = workInterestJobComparator(job1, job2)

      // Then
      expect(actual).toEqual(1)
    })

    it(`should return 1 given job with jobType 'OTHER' and another job's jobType is alphabetically after 'OTHER'`, () => {
      // Given
      const job1: WorkInterestJob = {
        jobType: 'OTHER',
        specificJobRole: 'Dental technician',
      }
      const job2: WorkInterestJob = {
        jobType: 'WAREHOUSING',
        specificJobRole: 'Forklift driver',
      }

      // When
      const actual = workInterestJobComparator(job1, job2)

      // Then
      expect(actual).toEqual(1)
    })

    it(`should return -1 given job with jobType alphabetically before 'OTHER' and another job's jobType is 'OTHER'`, () => {
      // Given
      const job1: WorkInterestJob = {
        jobType: 'CONSTRUCTION',
        specificJobRole: 'Builder',
      }
      const job2: WorkInterestJob = {
        jobType: 'OTHER',
        specificJobRole: 'Dental technician',
      }

      // When
      const actual = workInterestJobComparator(job1, job2)

      // Then
      expect(actual).toEqual(-1)
    })

    it(`should return -1 given job with jobType alphabetically after 'OTHER' and another job's jobType is 'OTHER'`, () => {
      // Given
      const job1: WorkInterestJob = {
        jobType: 'WAREHOUSING',
        specificJobRole: 'Forklift driver',
      }
      const job2: WorkInterestJob = {
        jobType: 'OTHER',
        specificJobRole: 'Dental technician',
      }

      // When
      const actual = workInterestJobComparator(job1, job2)

      // Then
      expect(actual).toEqual(-1)
    })

    it('should sort an array of Jobs alphabetically on jobType, but with OTHER at the end', () => {
      // Given
      const job1: WorkInterestJob = {
        jobType: 'RETAIL',
        specificJobRole: 'Shop assistant',
      }
      const job2: WorkInterestJob = {
        jobType: 'CONSTRUCTION',
        specificJobRole: 'Builder',
      }
      const job3: WorkInterestJob = {
        jobType: 'OTHER',
        specificJobRole: 'Dental technician',
      }
      const job4: WorkInterestJob = {
        jobType: 'WAREHOUSING',
        specificJobRole: 'Forklift driver',
      }

      const jobs = [job1, job2, job3, job4]

      const expected = [job2, job1, job4, job3] // alphabetically on type, with OTHER at the end

      // When
      jobs.sort(workInterestJobComparator)

      // Then
      expect(jobs).toEqual(expected)
    })
  })
})

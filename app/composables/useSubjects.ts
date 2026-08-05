import { useAcademyStore } from '~/stores/academy'
import type { SiteStageGroup, Stage, Subject } from '~/types'

// swap internals for API calls when backend lands; signature stays stable
export function useSubjects() {
  const store = useAcademyStore()
  return {
    all: store.subjects as Subject[],
    marketing: store.marketingSubjects,
    byName: (name: string) => store.subjects.find((s) => s.name === name),
    /** tone for a subject name, falling back to violet. */
    toneOf: (name: string) => store.subjects.find((s) => s.name === name)?.tone ?? 'violet',
    forStage: (stage: Stage) => store.subjects.filter((s) => s.stage.includes(stage)),
    /**
     * Subjects grouped for the public website, with a per-stage label and a
     * blurb written for that stage: Matematik reads differently at Tahun 3 than
     * at SPM. Separate seed from `all`, which is the portals' domain data.
     */
    byStage: () => store.siteStageGroups as SiteStageGroup[],
    /** which tutor teaches a subject (for the student detail view). */
    tutorFor: (name: string) => store.subjectTutor[name] ?? '',
    /** the usual slot a subject runs (for the student detail view). */
    scheduleFor: (name: string) => store.subjectSchedule[name] ?? '',
    /** syllabus bank for a stage: [subject, classes, materials][]. */
    bankFor: (stage: Stage) => store.syllabusBank[stage],
  }
}

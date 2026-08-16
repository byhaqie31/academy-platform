import { useAcademyStore } from '~/stores/academy'
import type { NewStudent } from '~/types'

/**
 * The walkthrough's write seam.
 *
 * Every fake action in the portals goes through here, so no screen reaches into
 * the store to mutate. Edits are an overlay on the seed and none of them
 * survive a refresh. When a backend lands, only these internals change.
 */
// swap internals for API calls when backend lands; signature stays stable
export function useDemoActions() {
  const store = useAcademyStore()

  return {
    /** Mark an invoice settled. Outstanding figures drop to match. */
    recordPayment: (invoiceId: string) => store.recordPayment(invoiceId),
    /** Send the WhatsApp reminder these families are waiting on. */
    chase: (guardianIds: string[]) => store.chase(guardianIds),
    /** Put a new student on the roll. */
    registerStudent: (input: NewStudent) => store.registerStudent(input),
    /** Whether a family has been chased during this walkthrough. */
    wasChased: (guardianId: string) => store.demo.chasedGuardianIds.includes(guardianId),
    /** Whether anything has been changed, so reset can stay hidden until useful. */
    get hasEdits() {
      const d = store.demo
      return (
        d.paidInvoiceIds.length > 0
        || d.chasedGuardianIds.length > 0
        || d.registeredStudents.length > 0
        || Object.keys(store.attendance).length > 0
      )
    },
    /** Drop the whole overlay so the next walkthrough starts on seeded state. */
    reset: () => store.resetDemo(),
  }
}

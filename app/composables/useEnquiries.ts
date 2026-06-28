import { useAcademyStore } from '~/stores/academy'
import type { Enquiry } from '~/types'

export type EnquiryFilter = 'all' | 'new' | 'pending' | 'week'

// swap internals for API calls when backend lands; signature stays stable
export function useEnquiries() {
  const store = useAcademyStore()
  const all = store.enquiries as Enquiry[]
  return {
    all,
    filter: (f: EnquiryFilter): Enquiry[] => (f === 'all' ? all : all.filter((e) => e.status === f)),
  }
}

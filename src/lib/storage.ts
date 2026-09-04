import { QuizForm, LeadSubmission } from "@/types/quiz"
import { mockForms, mockSubmissions } from "@/data/mockQuizzes"

const FORMS_STORAGE_KEY = "inlegado_forms_v1"
const LEADS_STORAGE_KEY = "inlegado_leads_v1"

export function getStoredForms(): QuizForm[] {
  if (typeof window === "undefined") return mockForms
  try {
    const raw = localStorage.getItem(FORMS_STORAGE_KEY)
    if (!raw) {
      localStorage.setItem(FORMS_STORAGE_KEY, JSON.stringify(mockForms))
      return mockForms
    }
    return JSON.parse(raw)
  } catch {
    return mockForms
  }
}

export function saveStoredForms(forms: QuizForm[]) {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(FORMS_STORAGE_KEY, JSON.stringify(forms))
  } catch (e) {
    console.error("Error saving forms to storage:", e)
  }
}

export function getFormById(id: string): QuizForm | undefined {
  const forms = getStoredForms()
  return forms.find(f => f.id === id) || mockForms.find(f => f.id === id)
}

export function saveForm(form: QuizForm) {
  const forms = getStoredForms()
  const index = forms.findIndex(f => f.id === form.id)
  let updated: QuizForm[]
  if (index !== -1) {
    updated = [...forms]
    updated[index] = form
  } else {
    updated = [...forms, form]
  }
  saveStoredForms(updated)
}

export function getStoredLeads(): LeadSubmission[] {
  if (typeof window === "undefined") return mockSubmissions
  try {
    const raw = localStorage.getItem(LEADS_STORAGE_KEY)
    if (!raw) {
      localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(mockSubmissions))
      return mockSubmissions
    }
    return JSON.parse(raw)
  } catch {
    return mockSubmissions
  }
}

export function saveLead(lead: LeadSubmission) {
  if (typeof window === "undefined") return
  try {
    const leads = getStoredLeads()
    const updated = [lead, ...leads]
    localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(updated))
  } catch (e) {
    console.error("Error saving lead:", e)
  }
}

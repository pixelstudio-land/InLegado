export type QuestionType = 'multiple_choice' | 'text' | 'phone' | 'number' | 'rating'

export interface QuizOption {
  id: string
  label: string
  subtitle?: string
  icon?: string
  image?: string
  nextQuestionId?: string
  score?: number
  isDisqualifying?: boolean
}

export interface QuizQuestion {
  id: string
  title: string
  subtitle?: string
  type: QuestionType
  required?: boolean
  placeholder?: string
  options?: QuizOption[]
  nextQuestionId?: string
  helpText?: string
}

export interface QuizTheme {
  primaryColor: string
  backgroundColor: string
  cardBackground: string
  textColor: string
  accentColor: string
  borderRadius: 'rounded-none' | 'rounded-lg' | 'rounded-xl' | 'rounded-2xl' | 'rounded-full'
  buttonStyle: 'modern' | 'glass' | 'bold' | 'minimal'
  showProgressBar: boolean
  socialProofBadge?: string
  logoUrl?: string
}

export interface ThankYouScreen {
  title: string
  subtitle: string
  ctaText: string
  ctaUrl?: string
  whatsappNumber?: string
  whatsappMessageTemplate?: string
  showSummary?: boolean
}

export interface QuizForm {
  id: string
  title: string
  clientSlug: string
  clientName: string
  description?: string
  theme: QuizTheme
  questions: QuizQuestion[]
  thankYouScreen: ThankYouScreen
  webhookUrl?: string
  createdAt: string
  stats: {
    views: number
    completions: number
    leads: number
  }
}

export interface LeadSubmission {
  id: string
  formId: string
  formTitle: string
  clientName: string
  name: string
  phone: string
  answers: Record<string, any>
  utmParams: Record<string, string>
  createdAt: string
  status: 'Novo' | 'Em Atendimento' | 'Convertido' | 'Desqualificado'
}
